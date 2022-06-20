import React, { memo } from 'react';

const Brand = () => (
	<React.Fragment>
		<img className="brand" src="/static/images/icon-cite.png" alt="Logo" />	
		<h1 className="brand">
				Mick Schroeder's<br/>
				Citation Generator		
		</h1>
	</React.Fragment>
);

export default memo(Brand);
