enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    PAYPAL = 'PAYPAL',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}
