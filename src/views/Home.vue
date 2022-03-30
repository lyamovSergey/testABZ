<template>
  <div>
    <HeaderVue></HeaderVue>
    <MainBanner></MainBanner>
    <div class="container">
      <CardBlock></CardBlock>
      <SubmitForm></SubmitForm>
    </div>
  </div>
</template>

<script>
import HeaderVue from '@/components/header/HeaderVue.vue'
import MainBanner from '@/components/main/MainBanner.vue'
import CardBlock from '@/components/main/CardBlock.vue'
import SubmitForm from '@/components/main/SubmitForm.vue'

export default {
  components: {
    HeaderVue,
    MainBanner,
    CardBlock,
    SubmitForm
  }
}
</script>
