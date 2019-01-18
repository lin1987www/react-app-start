import React from 'react';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const tree = renderer
        .create(<a href="http://www.facebook.com">Facebook</a>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});