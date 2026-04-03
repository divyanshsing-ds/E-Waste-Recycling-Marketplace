from rest_framework.throttling import UserRateThrottle


class BidRateThrottle(UserRateThrottle):
    scope = "bid_create"
