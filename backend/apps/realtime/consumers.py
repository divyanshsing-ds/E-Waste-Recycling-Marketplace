import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope['query_string'].decode().split('token=')[-1] if 'token=' in self.scope['query_string'].decode() else None
        
        if not token:
            await self.close(code=4001)
            return

        try:
            self.user = await self.get_user_from_token(token)
        except Exception:
            await self.close(code=4001)
            return

        self.room_group_name = f"user_{self.user.id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message", "")
        action = text_data_json.get("action", "broadcast")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "notification_message",
                "message": message,
                "action": action,
                "sender": self.channel_name
            }
        )

    async def notification_message(self, event):
        message = event["message"]
        action = event["action"]
        order_id = event.get("order_id")
        lat = event.get("lat")
        lng = event.get("lng")

        payload = {
            "message": message,
            "action": action,
        }
        if order_id:
            payload["order_id"] = order_id
        if lat is not None:
            payload["lat"] = lat
        if lng is not None:
            payload["lng"] = lng

        await self.send(text_data=json.dumps(payload))

    @database_sync_to_async
    def get_user_from_token(self, token):
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)

