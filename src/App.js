import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import './App.css';
import TopBar from './top-bar/Top-bar';
import BottomBar from './bottom-bar/Bottom-bar';
import ProductItem from './shopping-list/Product-item';

function App({ history }) {
	const [products, setProducts] = useState([]),
		[topBarInputValue, setTopBarInputValue] = useState(''),
		[isTopBarActive, setIsTopBarActive] = useState(false);

	const activate = () => {
		setIsTopBarActive(true);

		if (history.location.state
			&& history.location.state.alreadyActivatedBefore) {

			history.goForward();

			return;
		}

		history.replace('', { alreadyActivatedBefore: true })
		history.push('');
	};
	const inactivate = () => {
		setIsTopBarActive(false);
		setTopBarInputValue('');
	}

	useEffect(() => {
		fetchProducts().then(prods => setProducts(prods));
	}, []);

	useEffect(() => {
		if (isTopBarActive) {
			window.addEventListener('popstate', inactivate);
		}

		return () => {
			if (isTopBarActive) {
				window.removeEventListener('popstate', inactivate)
			}
		};
	}, [isTopBarActive]);

	const dropdownClass = isTopBarActive ? 'active' : '';
	return (

		<div className="App">
			<TopBar inputValue={topBarInputValue}
				isActive={isTopBarActive}
				onChange={e => setTopBarInputValue(e.target.value)}
				activate={activate}
				goBack={() => history.goBack()} />

			<div className="p-sides-10px">
				{products.map(product =>
					<ProductItem key={product.id} {...product} />
				)}
			</div>

			<div className={`App__dropdown p-sides-10px white ${dropdownClass}`}>
				<ul className="list reset-list">
					<li className="list__item">ADD</li>
					<li className="list__item">Autocomplete</li>
					<li className="list__item">Histórico</li>
				</ul>
			</div>

			<BottomBar />
		</div>

	);
}

function fetchProducts() {
	return fetch('/products')
		.then(response => response.json())
}

export default withRouter(App);
