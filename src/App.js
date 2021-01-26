import React, { Component } from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

class App extends Component {
  state = {
    name: '',
    days: [],
  };

  componentDidMount() {
    // set name
    const nameJson = localStorage.getItem('name');
    if (nameJson) {
      const name = JSON.parse(nameJson);
      this.setState(() => ({ name }));
    }

    // set checkboxes
    const daysJson = localStorage.getItem('days');
    if (daysJson) {
      const days = JSON.parse(daysJson);
      this.setState(() => ({ days }));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // update name if it changes
    if (prevState.name !== this.state.name) {
      const name = this.state.name;
      localStorage.setItem('name', JSON.stringify(name));
    }

    // save checkboxes
    if (prevState.days.length !== this.state.days.length) {
      const days = this.state.days;
      localStorage.setItem('days', JSON.stringify(days));
    }
  }

  // event handler for checkboxes
  handleCheckboxChange = (event) => {
    if (event.target.checked) {
      if (!this.state.days.includes(event.target.value)) {
        this.setState(prevState => ({ days: [...prevState.days, event.target.value]}))
      }
    } else {
      this.setState(prevState => ({ days: prevState.days.filter(day => day !== event.target.value) }));
    }
  }

  generateImage() {
    domtoimage.toBlob(document.getElementById('main'), {
      bgcolor: '#ffffff',
    }).then(function (blob) {
      saveAs(blob, '100-miles.png');
    });
  }

  render() {
    document.title = '100 Miles in 100 Days';
    return (
      <div className="App">
        <div className="container max-width-sm">
          <div id="main">
            <h1 className="text-center">100 Miles in 100 Days</h1>
            <h2 className="text-center">January 23 to May 2, 2021</h2>

            <div className="margin-y-sm">
              <label htmlFor="name" className="form-label margin-bottom-xxs text-bold">Name:</label>
              <input 
                  className="form-control width-100%" 
                  type="text" 
                  name="name" 
                  id="name" 
                  onChange={event => this.setState({ name: event.target.value })}
                  value={this.state.name}
                  autoComplete="off"
                  />
            </div>

            <p className="margin-top-sm margin-bottom-md text-center">
              <strong>Instructions:</strong> For each mile you run/walk OUTSIDE, fill in one block. 
              Fill in all 100 to earn a prize!
            </p>

            <div className="grid gap-sm">
              {Array.from(Array(100), (e, i) => {return (
                <div className="col-1 text-center" key={i}>
                  <div className="custom-checkbox">
                    <input 
                        className="custom-checkbox__input" 
                        type="checkbox" 
                        aria-label={`Day ${i + 1}`} 
                        id={`day-${i + 1}`}
                        value={`day-${i + 1}`}
                        onChange={this.handleCheckboxChange}
                        checked={this.state.days.includes(`day-${i + 1}`)}
                        />
                    <div className="custom-checkbox__control" aria-hidden="true"></div>
                  </div>
                </div>
              )})}
            </div>
            <p className="color-error text-center margin-top-md">Sponsored by the Badgerland Striders!</p>
          </div>
        </div>
        <div className="container max-width-sm text-center margin-y-md">
          <div className="text-component">
            <p>
              Download your grid 👇
            </p>
            <p>
              <button className="btn btn--primary" onClick={this.generateImage}>Download</button>
            </p>
            <p className="text-sm">
              Built with love and coffee by <a href="https://boldoak.design">Paul Eiche</a>. View the source <a href="https://github.com/peiche/100-miles-in-100-days">here</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;