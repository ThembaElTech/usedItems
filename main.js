const startButton = document.querySelector('#start-button');

startButton.addEventListener('click', () => {
  // Code to hide the onboarding screen and display the app
});

const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent form submission
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  // Create a new user with email and password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User registered successfully
      const user = userCredential.user;
      console.log('User registered:', user);
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
});

const itemsList = document.querySelector('#items-list');
const itemTemplate = document.querySelector('#item-template');

// Render the items in the HTML
function renderItems(items) {
  // Clear the items list
  itemsList.innerHTML = '';

  // Loop through each item and render it
  items.forEach((item) => {
    // Clone the item template
    const itemElement = itemTemplate.content.cloneNode(true);

    // Fill in the item data
    const itemName = itemElement.querySelector('.item-name');
    const itemDescription = itemElement.querySelector('.item-description');
    const itemPrice = itemElement.querySelector('.item-price');
    itemName.textContent = item.name;
    itemDescription.textContent = item.description;
    itemPrice.textContent = `$${item.price}`;

    // Add a click event listener to the item
    itemElement.querySelector('li').addEventListener('click', () => {
      // Handle item click event
      console.log('Item clicked:', item);
    });

    // Add the item to the items list
    itemsList.appendChild(itemElement);
  });
}

// Get the items data from Firebase
itemsCollection.get().then((querySnapshot) => {
  const items = [];
  querySnapshot.forEach((doc) => {
    // Get the data for each item
    const item = doc.data();
    item.id = doc.id;
    items.push(item);
  });

  // Render the items in the HTML
  renderItems(items);
});

// Initialize Firebase Authentication
const auth = firebase.auth();

// Handle login form submission
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the email and password from the form
  const email = loginForm['email'].value;
  const password = loginForm['password'].value;

  // Authenticate the user with Firebase
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      // Redirect the user to the home page
      window.location.href = 'index.html';
    })
    .catch((error) => {
      // Handle authentication errors
      console.error(error);
      alert('Incorrect email or password. Please try again.');
    });
});

// Initialize an empty cart
let cart = [];

// Function to add an item to the cart
function addToCart(item) {
  // Check if the item is already in the cart
  let existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    // If the item is already in the cart, increment its quantity
    existingItem.quantity++;
  } else {
    // If the item is not in the cart, add it with a quantity of 1
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
  }

  // Save the cart to local storage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display the items in the cart
function displayCart() {
  // Get the cart items from local storage
  cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Get the table body and clear its contents
  const tableBody = document.querySelector('#cart-items');
  tableBody.innerHTML = '';

  // Loop through each item in the cart and add a row to the table
  cart.forEach((item) => {
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.price * item.quantity}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  // Calculate and display the total cost of the cart
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalElement = document.querySelector('#cart-total');
  totalElement.textContent = total;
}

// Function to clear the cart
function clearCart() {
  // Clear the cart array and local storage
  cart = [];
  localStorage.removeItem('cart');
}

// Handle adding an item to the cart
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
addToCartBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const item = {
      id: e.target.dataset.itemId,
      name: e.target.dataset.itemName,
      price: parseFloat(e.target.dataset.itemPrice),
    };
    addToCart(item);
    displayCart();
  });
});

// Handle checkout button click
const checkoutBtn = document.querySelector('#checkout-btn');
checkoutBtn.addEventListener('click', () => {
  // Redirect the user to the checkout page
  window.location.href = 'checkout.html';
});

// Initialize Firebase
const firebaseConfig = {
    // Your Firebase config
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Handle form submission
  const uploadForm = document.querySelector('#upload-form');
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Get the form data
    const name = uploadForm['item-name'].value;
    const description = uploadForm['item-description'].value;
    const price = parseFloat(uploadForm['item-price'].value);
    const imageFile = uploadForm['item-image'].files[0];
  
    // Upload the image to Firebase Storage
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(imageFile.name);
    await imageRef.put(imageFile);
    const imageUrl = await imageRef.getDownloadURL();
  
    // Add the new item to the database
    const newItemRef = db.collection('items').doc();
    const newItem = {
      id: newItemRef.id,
      name,
      description,
      price,
      imageUrl,
      sellerId: firebase.auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await newItemRef.set(newItem);
  
    // Redirect the user to their listings page
    window.location.href = 'listings.html';
  });

  // Initialize Firebase
const firebaseConfig = {
    // Your Firebase config
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Handle form submission
  const profileForm = document.querySelector('#profile-form');
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Get the form data
    const firstName = profileForm['profile-firstname'].value;
    const lastName = profileForm['profile-lastname'].value;
    const location = profileForm['profile-location'].value;
    const contact = profileForm['profile-contact'].value;
    const photoFile = profileForm['profile-photo'].files[0];
  
    // Upload the profile photo to Firebase Storage
    let photoUrl;
    if (photoFile) {
      const storageRef = firebase.storage().ref();
      const photoRef = storageRef.child(photoFile.name);
      await photoRef.put(photoFile);
      photoUrl = await photoRef.getDownloadURL();
    }
  
    // Update the user profile data in Firestore
    const user = firebase.auth().currentUser;
    await db.collection('users').doc(user.uid).update({
      firstName,
      lastName,
      location,
      contact,
      photoUrl,
    });
  
    // Reload the page to reflect the updated profile data
    window.location.reload();
  });
  
  // Load the user profile data on page load
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        profileForm['profile-firstname'].value = data.firstName;
        profileForm['profile-lastname'].value = data.lastName;
        profileForm['profile-location'].value = data.location;
        profileForm['profile-contact'].value = data.contact;
        if (data.photoUrl) {
          const profilePhoto = document.createElement('img');
          profilePhoto.src = data.photoUrl;
          profileForm.insertBefore(profilePhoto, profileForm.querySelector('label'));
        }
      }
    }
  });
  