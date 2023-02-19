import Item from "item/item.interface";

interface CartItem {
    item: Item;
    total: number;
}

interface Cart {
    id: string;
    user: string;
    items: CartItem[];
}

export default Cart;
