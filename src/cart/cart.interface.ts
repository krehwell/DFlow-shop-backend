interface Cart {
    id: string;
    user: string;
    items: { item: string[]; total: number }[];
}

export default Cart;
