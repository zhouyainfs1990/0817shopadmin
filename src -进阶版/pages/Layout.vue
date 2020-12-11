<template>
    <div>
        {{username}}
    </div>
</template>
<script>
export default {
    computed:{
        username(){
            return this.$store.getters["user/username"]
        }
    }
}
</script>