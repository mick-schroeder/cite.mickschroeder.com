import './wdyr';
import SmoothScroll from 'smooth-scroll';
import ZoteroBibComponent from './bib-component';

const targetDom = document.getElementById('schroeder-cite');

if(targetDom) {
	const config = JSON.parse(document.getElementById('schroeder-cite-config').textContent);
	ZoteroBibComponent.init(targetDom, config);
} else {
	new SmoothScroll('main.faq a[href*="#"]', {offset: 16});
}
