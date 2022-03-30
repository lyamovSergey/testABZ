<template>
  <div class="card-block">
    <h2 class="card-block__title">Working with GET request</h2>
    <div class="grid-wrapper">
      <div class="card" v-for="(item, index) in sortUsers" :key="index">
        <div class="user-img">
          <picture>
            <source :src="item.photo" type="" />
            <img :src="item.photo" alt="" />
          </picture>
        </div>
        <p>{{ item.name }}</p>
        <p>
          {{ item.position }}<br />
          {{ item.email }}<br />
          {{ item.phone }}
        </p>
      </div>
    </div>
    <div class="button-block">
      <a
        href="javascript:;"
        v-show="showSubmitButton"
        class="link-btn"
        @click.prevent="showMore()"
        >Show more</a
      >
    </div>
  </div>
</template>
<script>
import settings from "@/settings.js";

export default {
  data: function () {
    return {
      users: [],
      nextPage: "",
      total_users: '',
      showSubmitButton: true
    };
  },
  methods: {
    showMore() {
      this.$store.dispatch("GET_USERS_LIST", this.nextPage).then((resp) => {
        this.nextPage = resp.data.links.next_url;
        this.users.push(...resp.data.users);
        this.total_users = resp.data.total_users;
        // Спрятать кнопку
        if(this.total_users <= this.users.length){
          this.showSubmitButton = false;
        }
      });
    },
    startComponent() {
      this.$store
        .dispatch(
          "GET_USERS_LIST",
          settings.apiUrl + `/users?page=1&count=${settings.usersCount}`
        )
        .then((resp) => {
          this.users = resp.data.users;
          this.nextPage = resp.data.links.next_url;
        });
    },
  },
  mounted() {
    let that = this;
    that.startComponent();
    that.$root.$on("updateCards", function (id) {
      that.startComponent();
    });
  },
  computed: {
    /** 
     * Сортировка пользователей по дате
     */
    sortUsers() {
      return this.users.sort(
        (a, b) => b.registration_timestamp - a.registration_timestamp
      );
    },
  },
};
</script>