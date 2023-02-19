interface CartItem {
    item: string;
    total: number;
}

interface Cart {
    id: string;
    user: string;
    items: CartItem[];
}

export default Cart;
