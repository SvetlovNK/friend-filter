const templateElement = require('../../filter-friend.hbs');

export default function () {
    const allFriends = document.querySelector('.js-common-friends');

    const filter = {
        allFriends: undefined,
        init: function () {
            (async() => {
               try {
                   this.authentication();
                   this.allFriends = await this.getFriends('friends.get', { fields: 'city,country, photo_100' });
                   this.renderFriends(this.allFriends);
               } catch (e) {
                   console.error(e);
               }
            })();
        },
        authentication: function () {
            return new Promise((resolve, reject) => {
                VK.init({
                    apiId: 6301314
                });

                VK.Auth.login(data => {
                    if (data.session) {
                        resolve();
                    } else {
                        reject(new Error('Не удалось авторизоваться'))
                    }
                }, 2);
            })
        },
        getFriends: function (method, params) {
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
        },
        renderFriends: function (friends) {
            const html = templateElement(friends);
            allFriends.innerHTML = html;
        }
    };

    filter.init();
}
