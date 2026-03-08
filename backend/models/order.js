class Order {
    constructor(value, items = []) {
        this.value = value;
        this.items = items; // Array de instâncias de Item
        this.creationDate = new Date();
    }
}

module.exports = Order;