import React, {Component} from 'react';


class Content extends Component {
    render() {
        return(
           <main className="App-content">
            {this.props.children}
           </main> 
        )
    }
}

export default Content;