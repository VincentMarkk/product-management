let productTable;

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();

  document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();
    saveProduct();
  });
});

function loadProducts() {
  if (productTable) productTable.destroy();
  fetch('http://localhost:3000/products')
    .then(res => res.json())
    .then(data => {
      productTable = $('#productTable').DataTable({
        data: data,
        columns: [
          { data: 'id' },
          { data: 'name' },
          { data: 'category_name' },
          { data: 'price' },
          {
            data: null,
            render: data => `
              <button onclick="editProduct(${data.id})">Edit</button>
              <button onclick="deleteProduct(${data.id})">Delete</button>
            `
          }
        ]
      });
    });
}

function loadCategories() {
  fetch('http://localhost:3000/categories')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('productCategory');
      select.innerHTML = '';
      data.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
      });
    });
}

function openForm(product = null) {
  document.getElementById('formModal').style.display = 'block';
  document.getElementById('formTitle').textContent = product ? 'Edit Product' : 'Add Product';
  document.getElementById('productId').value = product?.id || '';
  document.getElementById('productName').value = product?.name || '';
  document.getElementById('productCategory').value = product?.category_id || '';
  document.getElementById('productPrice').value = product?.price || '';
}

function closeForm() {
  document.getElementById('formModal').style.display = 'none';
  document.getElementById('productForm').reset();
}

function saveProduct() {
  const id = document.getElementById('productId').value;
  const data = {
    name: document.getElementById('productName').value,
    category_id: document.getElementById('productCategory').value,
    price: document.getElementById('productPrice').value
  };

  fetch(`http://localhost:3000/products${id ? '/' + id : ''}`, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    closeForm();
    loadProducts();
  });
}

function editProduct(id) {
  fetch(`http://localhost:3000/products/${id}`)
    .then(res => res.json())
    .then(data => openForm(data));
}

function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE'
    }).then(() => loadProducts());
  }
}
