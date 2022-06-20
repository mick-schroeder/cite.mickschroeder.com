import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const Footer = props => {
	const { isReadOnly } = props;
	
	return (
		<footer>
			{ !isReadOnly &&
				<nav className="social-nav">
					
				</nav>
				<div className="container">
				<small class="copyright">
					ZoteroBib is copyright © 2018 <a href="http://digitalscholar.org/">Corporation for Digital Scholarship</a>.
					<br/>
					All emojis designed by <a href="https://openmoji.org/" rel="nofollow">OpenMoji</a> – the open-source emoji and icon project. License: <a href="https://creativecommons.org/licenses/by-sa/4.0/#" rel="nofollow">CC BY-SA 4.0</a>
					<br/>
					© 2020 Mick Schroeder, LLC. License: <a href="https://www.gnu.org/licenses/agpl.html" rel="nofollow">GNU AGPL</a>
					<p>
					<a href="/terms.html">Terms of Use & Privacy Policy</a>
					</p>
					<p>
					This program is free software: you can redistribute it and/or modify
					it under the terms of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" rel="external">GNU Affero General Public License</a> as
					published by the <a href="https://www.fsf.org/" rel="external">Free Software Foundation</a>.
					</p>
					<p>
					This program is distributed in the hope that it will be useful,
					but WITHOUT ANY WARRANTY; without even the implied warranty of
					MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
					</p>
				</small>
				</div>

				
			</footer>
		);
	}
}

Footer.propTypes = {
	isReadOnly: PropTypes.bool,
};

export default memo(Footer);
