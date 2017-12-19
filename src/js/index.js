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
        dragElement: undefined,
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
            filterContainer.addEventListener('dragend', this.endDragFriend.bind(this));
            filterContainer.addEventListener('drop', this.handleDrop.bind(this));

            for (let i = 0; i < friendList.length; i++) {
                friendList[i].addEventListener('dragenter', this.handleEnter);
                friendList[i].addEventListener('dragover', this.handleOver);
                friendList[i].addEventListener('dragleave', this.handleLeave);
            }
        },
        dragFriend: function (event) {
            let target = event.target;
            this.dragElement = target;

            if (!target.classList.contains(friendClass)) return false;

            event.dataTransfer.effectAllowed = 'move';

            filterContainer.classList.add('drag');
            target.classList.add('drag');
        },
        endDragFriend: function (event) {
            let target = event.target;
            if (!target.classList.contains(friendClass)) return false;

            filterContainer.classList.remove('drag');
            target.classList.remove('drag');
        },
        handleEnter: function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';

            this.classList.add('over');
        },
        handleOver: function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            return false;
        },
        handleLeave: function() {
            this.classList.remove('over');
        },
        handleDrop: function (event) {
            let target = event.target;

            target.appendChild(this.dragElement);
            target.classList.remove('over');

            this.dragElement = undefined;
        }
    };

    filter.init();
}
