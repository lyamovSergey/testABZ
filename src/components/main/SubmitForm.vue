<template>
  <form class="submit-form" action="">
    <h2 class="submit-form__title">Working with POST request</h2>
    <label>
      <input
        autocomplete="off"
        type="text"
        name="username"
        v-model="formData.username"
        :class="{
          error: $v.formData.username.$dirty && !$v.formData.username.required,
        }"
      />
      <span :class="{ noEmpty: formData.username }" class="placeholder"
        >Your name</span
      >
      <span
        class="error"
        v-if="$v.formData.username.$dirty && !$v.formData.username.required"
        >Поле не должно быть пустым</span
      >
    </label>
    <label>
      <input
        autocomplete="off"
        type="text"
        name="mail"
        v-model="formData.mail"
        :class="{
          error:
            ($v.formData.mail.$dirty && !$v.formData.mail.required) ||
            ($v.formData.mail.$dirty && !$v.formData.mail.email),
        }"
      />
      <span :class="{ noEmpty: formData.mail }" class="placeholder">Email</span>
      <span
        class="error"
        v-if="$v.formData.mail.$dirty && !$v.formData.mail.required"
        >Поле не должно быть пустым</span
      >
      <span
        class="error"
        v-if="$v.formData.mail.$dirty && !$v.formData.mail.email"
        >Не корректный email</span
      >
    </label>
    <label class="label-phone">
      <input
        @input="addMaskEventInput($event)"
        @focus="addMaskEventFocus($event)"
        @blur="addMaskEventBlur($event)"
        @mouseout="addMaskEventMouseOut($event)"
        autocomplete="off"
        type="text"
        name="phone"
        v-model.trim="formData.phone"
        :class="{
          error: $v.formData.phone.$dirty && !$v.formData.phone.required,
        }"
      />

      <span :class="{ noEmpty: formData.phone }" class="placeholder"
        >Phone</span
      >
      <span
        class="error"
        v-if="$v.formData.phone.$dirty && !$v.formData.phone.required"
        >Поле не должно быть пустым</span
      >
    </label>
    <div class="checkbox-block">
      <p class="checkbox-block__title">Select your position</p>

      <label
        v-for="(item, index) in radioButtons"
        :key="index"
        class="my-custom-checkbox"
      >
        <input
          type="radio"
          v-model="formData.speciality"
          :value="item.id"
          name="speciality"
        />
        <span>{{ item.name }}</span>
      </label>
    </div>
    <label
      class="file-input"
      :class="{
        error:
          ($v.formData.userImage.$dirty && !$v.formData.userImage.required) ||
          $v.uploadFile.$error,
      }"
    >
      <input type="file" @change="onFileChange" />
      <span class="file-input__button">Upload</span>
      <span class="file-input__text">{{ filePlaceholder }}</span>
      <span
        class="error"
        v-if="$v.formData.userImage.$dirty && !$v.formData.userImage.required"
        >Поле не должно быть пустым</span
      >
      <span
        class="error"
        v-if="
          $v.formData.userImage.$dirty &&
          $v.uploadFile.$error &&
          $v.formData.userImage.required
        "
        >Файл не должен быть больше 3МБ</span
      >
    </label>
    <input
      type="submit"
      @click.prevent="sendForm()"
      class="link-btn"
      :class="{ disabled: disabledSendButton }"
      value="Sign up"
    />
  </form>
</template>
<script>
import { email, required } from "vuelidate/lib/validators";
import Swal from "sweetalert2";

/**
 * custom validator проверка размера файла
 */
const file_size_validation = (value, vm) => {
  if (!value) {
    return true;
  }
  let file = vm.uploadFile;
  return Math.round(file.size / 1024) < 3072; //3МБ
};

export default {
  data: function () {
    return {
      radioButtons: {},
      formData: {
        speciality: "",
        username: "",
        mail: "",
        phone: "",
        userImage: "",
      },
      disabledSendButton: true,
      token: "",
      filePlaceholder: "Upload your photo",
      uploadFile: {},
    };
  },
  validations: {
    formData: {
      speciality: { required },
      username: { required },
      mail: { email, required },
      phone: { required },
      userImage: { required },
    },
    uploadFile: {
      file_size_validation,
    },
  },
  methods: {
    /**
     * маска для телефона
     */
    addMaskEventInput: function (e) {
      var that = this;
      let value = that.formData.phone.replace(/\D+/g, "");
      let numberLength = 12;
      let result;
      result = "+38(";

      for (let i = 2; i < value.length && i < numberLength; i++) {
        switch (i) {
          case 5:
            result += ") ";
            break;
          case 8:
            result += "-";
            break;
          case 10:
            result += "-";
            break;
          default:
            break;
        }
        result += value[i];
      }

      that.formData.phone = result;
    },
    addMaskEventFocus: function (e) {
      var that = this;
      let value = that.formData.phone.replace(/\D+/g, "");
      if (value.length == 0) {
        that.formData.phone = "+38 (";
      }
    },
    addMaskEventBlur: function (e) {
      var that = this;
      let value = that.formData.phone.replace(/\D+/g, "");
      let numberLength = 12;
      if (value.length != numberLength) {
        that.formData.phone = "";
      }
    },
    addMaskEventMouseOut: function (e) {
      e.target.setAttribute("placeholder", "");
    },
   
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
      this.$v.$touch();
    },
    createImage(file) {
      let image = new Image();
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        vm.formData.userImage = file;
        vm.filePlaceholder = file.name;
        vm.uploadFile = file;
      };
      reader.readAsDataURL(file);
    },
    
    sendForm() {
      let that = this;

      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      } else {
        that.$addPreloader();

        this.$store.dispatch("GET_TOKEN").then((resp) => {
          let userInfo = this.formData;
          userInfo.token = resp.data.token;

          this.$store
            .dispatch("SET_USER", userInfo)
            .then((response) => {
              this.$root.$emit("updateCards");
              that.$removePreloader();

              Swal.fire({
                text: "Пользователь зарегистрирован!",
                imageUrl: require("../../assets/success-image.svg"),
                confirmButtonText: "OK",
              }).then((response) => {
              
                if (response.isDismissed || response.isConfirmed) {
                  that.formData.speciality = "";
                  that.formData.username = "";
                  that.formData.mail = "";
                  that.formData.phone = "";
                  that.formData.userImage = "";
                  that.filePlaceholder = "Upload your photo";
                  that.$v.$reset();
                }
              });

            })
            .catch((err) => {
              that.$removePreloader();
              let errorText = "";
              for (var key in err.response.data.fails) {
                errorText = err.response.data.fails[key];
              }
              Swal.fire({
                title: "Error!",
                text: errorText,
                icon: "error",
                confirmButtonText: "OK",
              });
            });
        });
      }
    },
  },
  mounted() {
    this.$store.dispatch("GET_SPECIALITY_LiST").then((resp) => {
      this.radioButtons = resp.data.positions;
      this.formData.speciality = "1";
    });
  },
  watch: {
    formData: {
      handler(val, oldVal) {
        if (val.mail != "" && val.phone != "" && val.username != "" && val.userImage != "") {
          this.disabledSendButton = false;
        } else {
          this.disabledSendButton = true;
        }
      },
      deep: true,
    },
  },
};
</script>