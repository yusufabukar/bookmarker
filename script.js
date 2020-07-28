const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const form = document.querySelector('form');
const websiteNameElement = document.getElementById('website-name');
const websiteAddressElement = document.getElementById('website-address');
const bookmarksContainer = document.getElementById('bookmarks-container');
let bookmarks = new Array();

function showModal() {
	modal.classList.add('show-modal');
	websiteNameElement.focus();
};

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', e => e.target === modal ? modal.classList.remove('show-modal') : null);

function validate(nameValue, addressValue) {
	const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
	const regex = new RegExp(expression);

	if (!nameValue || !addressValue) {
		alert('Please submit values for both fields.');
		return false;
	};
	if (!addressValue.match(regex)) {
		alert('Please provide a valid website address.');
		return false;
	};
	
	return true;
};

function buildBookmarks() {
	bookmarksContainer.textContent = '';

	bookmarks.forEach(bookmark => {
		const { name, address } = bookmark;

		const item = document.createElement('div');
		item.classList.add('item');
		const closeIcon = document.createElement('i');
		closeIcon.classList.add('fas', 'fa-times');
		closeIcon.setAttribute('title', 'Delete Bookmark');
		closeIcon.setAttribute('onclick', `deletebookmark('${address}')`);
		const linkInfo = document.createElement('div');
		linkInfo.classList.add('name');
		const favicon = document.createElement('img');
		favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${address}`);
		favicon.setAttribute('alt', 'Favicon');
		const link = document.createElement('a');
		link.setAttribute('href', `${address}`);
		link.setAttribute('target', '_blank');
		link.textContent = name;

		linkInfo.append(favicon, link);
		item.append(closeIcon, linkInfo);
		bookmarksContainer.appendChild(item);
	});
};

function fetchBookmarks() {
	if (localStorage.getItem('bookmarks')) {
		bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	} else {
		bookmarks = [{
			name: 'Yusuf Abukar',
			address: 'https://portfolio.yusufabukar.com'
		}];
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	};
	buildBookmarks();
};

function deletebookmark(address) {
	bookmarks.forEach((bookmark, i) => {
		if (bookmark.address === address) {
			bookmarks.splice(i, 1);
		};
	});
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	fetchBookmarks();
};

function saveBookmark(e) {
	e.preventDefault();
	const nameValue = websiteNameElement.value;
	let addressValue = websiteAddressElement.value;
	if (!addressValue.includes('http://', 'https://')) {
		addressValue = `https://${addressValue}`;
	};
	if (!validate(nameValue, addressValue)) {
		return false;
	};

	const bookmark = {
		name: nameValue,
		address: addressValue
	};
	bookmarks.push(bookmark);
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	fetchBookmarks();
	form.reset();
	websiteNameElement.focus();
};

form.addEventListener('submit', saveBookmark);

fetchBookmarks();