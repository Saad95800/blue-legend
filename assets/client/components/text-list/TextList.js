import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button } from 'reactstrap';
import {capitalizeFirstLetter} from './../functions';

export default class TextList extends Component {

  constructor(props){
    console.log("textList");
    super(props);

    let textes = [];
    let id_category = '';
    
    if(this.props.data.app == 'server'){ // AppServer
      textes = this.props.data.textes;
      id_category = this.props.data.id_category;
    }
    this.state = {
      textes: textes,
      id_category: id_category
    }

  }

  componentDidMount(){

    let data = {};
    let url = window.location.href.split("//")[1].replace(window.location.href.split("//")[1].split("/")[0], "");

    if(this.props.data.app == 'client'){
      
      if( url.indexOf('textes/category') != -1 ){

        data = {
          id_category: url.split("/")[3]
        }
      }

      axios({
        method: 'post',
        url: '/textes-ajax',
        responseType: 'json',
        data: data
      })
      .then((response) => {
        this.setState({textes: response.data, id_category:url.split("/")[3]});
      })
      .catch( (error) => {
        console.log(error);
      });

    }

  }
    render() {

      let textes = this.state.textes.map((texte, index) => {
        let textTitle = texte.title.length > 20 ? texte.title.substring(0, 20)+'...' : texte.title;
        return  <div className="col-xs-4 col-sm-2">
                  <Link
                    to={'/texte/'+texte.id}
                    key={index}>
                    <div key={texte.id} className="text-list-hover-item">
                      <div className="display-flex-center" style={{textAlign: 'center', height: '40px'}}>{ capitalizeFirstLetter(textTitle) }</div>
                      <div style={{'textAlign': 'center'}}>
                      <span className="img-item-liste-texte"></span>
                      </div>
                    </div>
                  </Link>
                </div>;
      });
      return (
              <div className="container-text-list container-page">
                <Container>
                  <Row>
                    <div className="main-titles">
                      LISTE DES TEXTES
                    </div>
                  </Row>
                  <Row>
                    <Col xs={{ size: 3, offset: 9 }} style={{textAlign: 'right', marginTop: '16px'}}>
                    <Link to={'/ajout-texte'}>
                      <Button className="btn-forms">Ajouter un texte</Button>
                    </Link>
                    </Col>
                  </Row>
                  <Row style={{marginTop: '20px'}}>
                    {textes}
                  </Row>
                </Container>
              </div>
      );
    }

  }