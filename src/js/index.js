const templateElement = require('../../filter-friend.hbs');

export default function () {
    const friendClass = 'js-friend';
    const friendListsClass = 'js-friends-list';

    const filterContainer = document.querySelector('.js-filter');
    const commonFriends = document.querySelector(`.${friendListsClass}[data-list="common"]`);
    const favoriteFriens = document.querySelector(`.${friendListsClass}[data-list="favorites"]`);
    const friendList = document.querySelectorAll(`.${friendListsClass}`);

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
            this.dragAndDropFriends();

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
            commonFriends.innerHTML = html;
        },
        dragAndDropFriends: function() {
            filterContainer.addEventListener('dragstart', this.dragFriend.bind(this));
            filterContainer.addEventListener('dragend', this.dropFriend.bind(this));

            for (let i = 0; i < friendList.length; i++) {
                friendList[i].addEventListener('dragenter', this.handleOver);
                friendList[i].addEventListener('dragleave', this.handleLeave);
            }
        },
        dragFriend: (event) => {
            let target = event.target;
            if (!target.classList.contains(friendClass)) return false;

            target.classList.add('drag');
        },
        dropFriend: (event) => {
            let target = event.target;
            if (!target.classList.contains(friendClass)) return false;

            target.classList.remove('drag');
        },
        handleOver: function() {
            this.classList.add('over');
        },
        handleLeave: function() {
            this.classList.remove('over');
        }
    };

    filter.init();
}
