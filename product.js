import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js";

let myModal = "";
let delProductModal = "";

const app = createApp({
  data() {
    return {
      api: {
        url: "https://ec-course-api.hexschool.io/v2",
        path: "ttedd",
      },
      products: [],
      tempProduct: {},
      is_new: false,
    };
  },
  methods: {
    checkLogin() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)tedToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .post(`${this.api.url}/api/user/check`)
        .then((res) => {
          this.productList();
        })
        .catch((err) => {
          window.alert("驗證錯誤，請重新登入");
          window.location = "login.html";
        });
    },
    productList() {
      axios
        .get(`${this.api.url}/api/${this.api.path}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        });
    },
    updateProduct() {
      let url = this.is_new
        ? `${this.api.url}/api/${this.api.path}/admin/product`
        : `${this.api.url}/api/${this.api.path}/admin/product/${this.tempProduct.id}`;
      let http = this.is_new ? "post" : "put";

      axios[http](url, {
        data: this.tempProduct,
      })
        .then(() => {
          myModal.hide();
          this.productList();
        })
        .catch((err) => {
          console.dir(err);
        });
    },
    openModal(status, product) {
      if (status === "new") {
        this.is_new = true;
        this.tempProduct = {};
        myModal.show();
      } else if (status === "edit") {
        this.is_new = false;
        this.tempProduct = { ...product };
        myModal.show();
      } else if (status === "del") {
        this.tempProduct = { ...product };
        delProductModal.show();
      }
    },
    delProduct() {
      axios
        .delete(
          `${this.api.url}/api/${this.api.path}/admin/product/${this.tempProduct.id}`
        )
        .then(() => {
          delProductModal.hide();
          this.productList();
        });
    },
    addImage() {
      if (!this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl = [];
      }
      this.tempProduct.imagesUrl.push("");
    },
    delImage() {
      this.tempProduct.imagesUrl.pop();
    },
  },
  mounted() {
    this.checkLogin();
    myModal = new bootstrap.Modal(document.querySelector("#productModal"), {
      // 無法使用鍵盤跳出
      keyboard: false,
      // 無法按空白處跳出
      backdrop: "static",
    });
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );
  },
});

app.mount("#app");
