window.onload = function () {
    new Vue({
        el: '.total',
        data: {
            isContainerVisible: false,
            browserHeight: 0,
        },
        mounted() {
            // 浏览器高度
            this.browserHeight = window.innerHeight;
        },
    })
}