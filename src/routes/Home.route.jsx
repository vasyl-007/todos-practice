import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Header } from '../components/Header.component';

export const Home = () => {
    return (
        <div>
            <Header />
            <h2>Home</h2>
        </div>
    )
};

export const About = () => {
    return (
        <div>
            <Header />
            <h2>About</h2>
        </div>
    )
};

export const Topics = ({ match }) => {
    return (
        <div>
            <Header />
            <h2>Topics</h2>
            <ul>
                <li>
                    <Link to={`${match.url}/rendering`}>Rendering with React</Link>
                </li>
                <li>
                    <Link to={`${match.url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
                </li>
            </ul>

            <Route path={`${match.url}/:topicId`} component={Topic} />
            <Route
                exact
                path={match.url}
                render={() => <h3>Please select a topic.</h3>}
            />
        </div>
    )
};

export const Topic = ({ match }) => {
    return (
        <div>
            <h3>{match.params.topicId}</h3>
        </div>
    )
};

//export { Home, About, Topics, Topic }
