var eventBus = new Vue();

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
<div class="product">
<div class="product-image">
  <img v-bind:src="image" />
</div>

<div class="product-info">
  <h1>{{ title }}</h1>
  <p v-if="inStock > 10">In Stock</p>
  <p v-else-if="inStock <= 10 && inStock > 0">Almost Sold Out</p>
  <p v-else class="outofStock">Out Of Stock</p>
  <p>Shipping: {{ shipping }}</p>

  <p>{{ sale }}</p>

  <p>Materials</p>
  <product-details :details="details"></product-details>

  <p>Sizes</p>
  <ul>
    <li v-for="size of sizes">{{ size }}</li>
  </ul>

  <p>Colors</p>
  <div
    v-for="(variant, index) in variants"
    :key="variant.variantId"
    class="color-box"
    :style="{backgroundColor: variant.variantColor}"
    @mouseover="updateProduct(index)"
  ></div>

  <button
    v-on:click="addToCart"
    :disabled="!inStock"
    :class="{ disabledButton: !inStock }"
  >
    Add to Cart
  </button>

  <button v-on:click="deleteFromCart">Delete Cart</button>

  <product-tabs :reviews="reviews"></product-tabs>

</div>
</div>
`,

  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      selectedVariant: 0,
      onSale: true,
      details: ["80% Cotton", "20% Polyester", "Gender-neutral"],
      sizes: ["10", "11", "12"],
      variants: [
        {
          variantId: 2234,
          variantColor: "Green",
          variantImage: "./vmSocks-green-onWhite.jpg",
          variantQuantity: 0
        },
        {
          variantId: 2235,
          variantColor: "Blue",
          variantImage: "./vmSocks-blue-onWhite.jpg",
          variantQuantity: 10
        }
      ],
      reviews: []
    };
  },

  methods: {
    addToCart: function() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    deleteFromCart: function() {
      this.$emit(
        "delete-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct: function(index) {
      this.selectedVariant = index;
      console.log(index);
    }
  },

  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + " " + this.product + " are on sale!";
      }
      return this.brand + " " + this.product + " are not on sale";
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    }
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});
Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  
    <p v-if="errors.length">
      <b>Please Correct the follwing error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p> 


  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>
  
  <p>
    <label for="review">Review:</label>      
    <textarea id="review" v-model="review"></textarea>
  </p>
  
  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>
    <label for="recommend">Would you recommend this product:</label>
    <br>
    <input type="radio" id="yes" value="Yes" v-model="picked">
    <label for="yes">Yes</label>
    <br>
    <input type="radio" id="no" value="No" v-model="picked">
    <label for="no">No</label>
    <br>
    <span>Picked: {{ picked }}</span>
  </p>
  
  <p>
    <input type="submit" value="Submit">  
  </p>    

</form>`,

  data() {
    return {
      name: null,
      review: null,
      rating: null,
      picked: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.rating && this.review && this.picked) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          picked: this.picked
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.picked = null;
      } else {
        if (!this.name) this.errors.push("Name Required");
        if (!this.rating) this.errors.push("Rating Required");
        if (!this.review) this.errors.push("Review Required");
        if (!this.picked) this.errors.push("Picked Required");
      }
    }
  }
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
    <span class="tab" 
          :class="{ activeTab: selectedTab === tab}"   
          v-for="(tab, index) in tabs" :key="index"
          @click="selectedTab = tab">
          {{ tab }}</span>    

    <div v-show="selectedTab === 'Reviews'">
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There is no revies yet.</p> 
      <ul>
        <li v-for="review in reviews">
        <p>Name: {{review.name}}</p>
        <p>Rating: {{review.rating}}</p>
        <p>Review: {{review.review}}</p>
        <p>Would you recommend this product: {{review.picked}}</p>
        </li>
      </ul>
    </div>

  <product-review v-show="selectedTab === 'Make a Review'"></product-review>
  </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews"
    };
  }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    deleteCart(id) {
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
