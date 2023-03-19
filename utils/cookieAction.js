exports.raiseQuantityByOne = async (cart, id, price) => {
  let existingProduct = cart.products.findIndex(
    (prod) => prod.productId.toString() === id.toString()
  );

  let newQuantity = 1;
  let productsUpdate = [...cart.products];

  if (existingProduct >= 0) {
    newQuantity = cart.products[existingProduct].quantity + 1;
    productsUpdate[existingProduct].quantity = newQuantity;
  } else
    productsUpdate.push({
      productId: id,
      quantity: newQuantity,
    });

  cart.products = productsUpdate;
  cart.total = cart.total + price;

  return cart;
};

exports.reduceQuantityByOne = async (cart, id, price) => {
  let existingProduct = cart.products.findIndex(
    (prod) => prod.productId.toString() === id.toString()
  );

  let newQuantity;
  let productsUpdate = [...cart.products];

  if (existingProduct >= 0) {
    newQuantity = cart.products[existingProduct].quantity - 1;
    productsUpdate[existingProduct].quantity = newQuantity;
    cart.products = productsUpdate;
    cart.total = cart.total - price;
  }

  return cart;
};

exports.removeOneProduct = async (cart, id, price) => {
  let productsUpdate = [...cart.products];

  const product = productsUpdate.find(
    (prod) => prod.productId.toString() === id.toString()
  );

  productsUpdate = productsUpdate.filter(
    (prod) => prod.productId.toString() !== id.toString()
  );
  cart.products = productsUpdate;
  cart.total = cart.total - price * product.quantity;

  return cart;
};
