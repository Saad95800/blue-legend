import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavItem extends Component {

  constructor(props){
    super(props);
  }

  colorClickItem(event){
    if(this.props.classContainer == 'bloc-btn-menu-vitrine'){
      window.location.href = '/';
    }else{
      this.props.colorClickItem(event);
    }
  }

  colorHoverItem(event){
      this.props.colorHoverItem(event);
  }

  colorMouseOutItem(event){
      this.props.colorMouseOutItem(event);
  }

  render() {
    let color = 'rgb(117, 222, 235, 0)';
    if(this.props.url_courante == this.props.url || this.props.isSelected){
      color = 'rgb(32, 96, 250)';
    }
    let style = this.props.style;
    style = Object.assign({backgroundColor: color}, style);
    return (
        <div className={this.props.classContainer} style={style} >
            <Link
                to={this.props.url}
                className={this.props.classItem} 
                onMouseOver={this.colorHoverItem.bind(this)} 
                onMouseOut={this.colorMouseOutItem.bind(this)} 
                onClick={this.colorClickItem.bind(this)} 
                id={this.props.id}>
            </Link>
        </div>
    );
  }
}
