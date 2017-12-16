const Handlebars = require('handlebars/dist/handlebars');

export default function () {
    const allFriends = document.querySelector('.js-common-friends');

    VK.init({
        apiId: 6301314
    });
    
    function authUser() {
        return new Promise((resolve, reject) => {
            VK.Auth.login(data => {
                if (data.session) {
                    resolve();
                } else {
                    reject(new Error('Не удалось авторизоваться'))
                }
            }, 2);
        });
    }

    function callAPI(method, params) {
        params.v = '5.69';

        return new Promise((resolve, reject) => {
            VK.api(method, params, (data) => {
                if (!data.error) {
                    resolve(data.response);
                } else {
                    reject(data.error);
                }
            });
        })
    }

    (async() => {
        try {
            authUser();

            // const friends = await callAPI('friends.get', { fields: 'city,country, photo_100' });
            // const template = document.querySelector('#friend-template').textContent;
            // const render = Handlebars.compile(template);
            // const html = render(friends.items);

            const friends = await callAPI('friends.get', { fields: 'city,country, photo_100' });
            const template = document.querySelector('#friend-template').textContent;
            const render = Handlebars.compile(template);
            const html = render(friends);

            console.log(html);

            allFriends.innerHTML = html;

        } catch (e) {
            console.error(e);
        }
    })();
}
