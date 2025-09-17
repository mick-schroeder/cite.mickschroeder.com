import { Fragment, memo } from 'react';

const Brand = () => (
	<Fragment>
		<h1 className="brand scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
			<a href="/" className="no-underline text-foreground hover:no-underline">
			Mick Schroeder's Citation Generator
			</a>
		</h1>
	</Fragment>
);

export default memo(Brand);
