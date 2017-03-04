import BaseModule from "../../baseModule";
import App from './App';
class Main extends BaseModule{

}
new Main().init({
    template: '<app :options="options"></app>',
    el: '#app',
    data: function () {
        return {
            options: {

            }
        }
    },
    components: { App }
});