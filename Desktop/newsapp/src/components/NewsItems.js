import React, { Component } from 'react'

export class NewsItems extends Component {
 
  render() {
   
    let {title,description,imageUrl,newsUrl}= this.props;
    return (
      
        <div className="my-3">
       <div className="card" style={{width: "18rem"}}>
  <img src={!imageUrl?"https://cleantechnica.com/wp-content/uploads/2025/04/New-Volkswagen-trio.jpg":imageUrl} className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">{title}</h5>
    <p className="card-text">{description}</p>
    <a href={newsUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-danger">Read More</a>
    
  </div>
</div>
      </div>
      
    )
  }
}

export default NewsItems
