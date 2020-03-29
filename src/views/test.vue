<template>
  <testComponent/>
</template>

<script>
// @ is an alias to /src
import testComponent from '@/components/test.vue'

export default {
  name: 'test',
  components: {
    testComponent
  }
}
</script>
