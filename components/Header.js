import nav from './data/nav.js';

const Header = (refNode, data) => {

  const navItems = nav.map((obj) => {
    const className = obj.name.toLowerCase();
    return [
  		`<span class="navSpan">`,
  		  `<a class="navA ${className}" href="${obj.link}">${obj.name}</a>`,
  		`</span>`
  	].join('');
  });

	const item = document.createElement('div');
	item.innerHTML = navItems.join('');
	const classes = ['navItems', 'nav',];
	item.classList.add(...classes);
	refNode.insertBefore(item, null);
};

export default Header;
