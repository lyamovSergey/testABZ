<template>
  <div
    class="main-banner"
    :style="{ backgroundImage: 'url(' + bannerImg + ')' }"
  >
    <div class="text-block">
      <h1 class="main-title">Test assignment for front-end developer</h1>
      <p>
        What defines a good front-end developer is one that has skilled
        knowledge of HTML, CSS, JS with a vast understanding of User design
        thinking as they'll be building web interfaces with accessibility in
        mind. They should also be excited to learn, as the world of Front-End
        Development keeps evolving.
      </p>
      <a href="" class="link-btn">Sign up</a>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      bannerImg: require("../../assets/banner.webp"),
    };
  },
  methods: {
    // Проверка поддержки webp
    checkWebp(){
      try {
        return (
          document
            .createElement("canvas")
            .toDataURL("image/webp")
            .indexOf("data:image/webp") == 0
        );
      } catch (err) {
        return false;
      }
    }
  },
  mounted() {
    if(this.checkWebp()){
      this.bannerImg = require("../../assets/banner.webp");
    }else{
      this.bannerImg = require("../../assets/banner.jpg");
    }
  },
};
</script>