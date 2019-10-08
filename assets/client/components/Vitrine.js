import React, { Component } from 'react';
import axios from 'axios';
import {Container, Row, Col, FormGroup, Label, Input} from 'reactstrap';


export default class Vitrine extends Component {
  
  constructor(props){
    super(props);

    let msgFlash = '';
    let hmsgf = '0px';
    let bgcmsgf = 'transparent';
    let displayBtnCloseMf = 'none';
    let confirmation = '';
    if(this.props.data.app == 'server'){
      confirmation = this.props.data.confirmation;
    }else if(this.props.data.get[0] != undefined){
      confirmation = this.props.data.get[0].confirmation;
      console.log(this.props.data.get[0]);
    }

    if(confirmation == 'true'){
      msgFlash = 'Votre compte a bien été activé, vous pouvez maintenant vous y connecter.';
      hmsgf = '40px';
      bgcmsgf = '#00ba62';
      displayBtnCloseMf = 'inline-block';
    }else if(confirmation == 'already'){
      msgFlash = 'Votre compte a déjà été activé, vous pouvez vous y connecter.';
      hmsgf = '40px';
      bgcmsgf = 'rgba(255, 29, 22, 1)';
      displayBtnCloseMf = 'inline-block';
    }

    this.state = {
      msgFlash: msgFlash,
      heightMsgFlash: hmsgf,
      bgColorMsgFlash: bgcmsgf,
      displayBtnCloseMf: displayBtnCloseMf,
      popupSignup: false,
      popupSignin: false,
      username: '',
      email: '',
      password1: '',
      password2: ''
    }

  }
  
  viewMessageFlash(msg, error = false, timeout = true){
    let mf = document.querySelector("#message-flash");
    let btnmf = document.querySelector(".btn-close-message-flash");
    mf.style.height = '40px';
    mf.innerHTML = msg;
    btnmf.style.display = 'inline-block';
    if(error){
      mf.style.backgroundColor = 'rgb(255, 29, 22)';
    }else{
      mf.style.backgroundColor = '#00ba62';
    }
    if(timeout){
      setTimeout(function(){
        mf.style.height = '0px';
        mf.style.padding = '0px';
        mf.innerHTML = '';
        btnmf.style.display = 'none';
      }, 3000);
    }

  }

  closeMessageFlash(){
    console.log('close message flash');
    let mf = document.querySelector("#message-flash");
    let btnmf = document.querySelector(".btn-close-message-flash");
    mf.style.height = '0px';
    mf.style.padding = '0px';
    mf.innerHTML = '';
    btnmf.style.display = 'none';
  }
  
  viewPopupSignup(){
    this.setState({
      popupSignup: true,
      popupSignin: false,
      username: '',
      email: '',
      password1: '',
      password2: ''
    });
  }
  
  viewPopupSignin(){
    this.setState({
      popupSignup: false,
      popupSignin: true,
      username: '',
      email: '',
      password1: '',
      password2: ''
    });
  }
  
  closePopups(){
    this.setState({
      popupSignup: false,
      popupSignin: false,
      username: '',
      email: '',
      password1: '',
      password2: ''
    });
  }

  saveUser(){

    if(this.state.username != '' &&
    this.state.email != '' &&
    this.state.password1  != '' &&
    this.state.password2  != '' ){
      if(this.state.password1 == this.state.password2){
        let res = this.checkPassword(this.state.password1);
        if(Array.isArray(res)){
          this.viewMessageFlash(res[1], true);
        }else{
          axios({
            method: 'post',
            url: '/save-user-ajax',
            responseType: 'json',
            data: {username: this.state.username, email: this.state.email, password: this.state.password1 }
          })
          .then((response) => {
            console.log(response);
            if(response.statusText == 'OK'){
              if(response.data.error == true){
                this.viewMessageFlash(response.data.msg, true);
              }else{
                window.localStorage.setItem('id_user', response.data.user.id);
                this.viewMessageFlash(response.data.msg, false, false);
                // document.location.href="/accueil";
              }
            }else{
              this.viewMessageFlash('Erreur lors de la création de l\'utilisateur', true);
            }

          })
          .catch( (error) => {
            console.log(error);
            this.viewMessageFlash('Erreur lors de l\'ajout', true);
          });
        }
      }else{
        this.viewMessageFlash('Les deux mots de passe doivent être identiques', true);
      }
    }else{
      this.viewMessageFlash('Tout les champs doivent être remplis.', true);
    }


  }

  checkPassword(pwd){
    let error = false;
    let msg = '';
    let csp = ['À','Á','Â','Ã','Ä',',','Å','Æ','Ç','È','É','Ê','Ë','Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö','Ø','Œ','Š','þ','Ù','Ú','Û','Ü','Ý','Ÿ','à','á','â','ã','ä','å','æ','ç','è','é','ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô','õ','ö','ø','œ','š','Þ','ù','ú','û','ü','ý','ÿ','¢','ß','¥','£','™','©','®','ª','×','÷','±','²','³','¼','½','¾','µ','¿','¶','·','¸','º','°','¯','§','…','¤','¦','≠','¬','ˆ','¨','‰'];
    if(typeof pwd == 'string'){
      if(pwd.length > 5){
        for (let cs of csp){
          if(pwd.indexOf(cs) != -1){
            error = true;
            msg = 'Les caractères spéciaux sont interdits';
            break;
          }
        }        
      }else{
        error = true;
        msg = 'Le mot de passe doit faire au moins 6 caratères';  
      }

    }else{
      error = true;
      msg = 'Le format du mot de passe est incorrect';
    }
    if(error == true){
      return [false, msg];
    }
    return true;
  }

  login(e){
    e.preventDefault();
    axios({
      method: 'post',
      url: '/login',
      responseType: 'json',
      data: {email: this.state.email, password: this.state.password1, username: this.state.username }
    })
    .then((response) => {
      console.log(response);
      if(response.data.user == false){
        this.viewMessageFlash('Identifiants ou mot de passe incorrect', true);
      }else if(response.data.error == true){
        this.viewMessageFlash(response.data.msg, true);
      }else{
        window.localStorage.setItem('id_user', response.data.user.id);
        document.location.href="/accueil";
      }
    })
    .catch( (error) => {
      console.log(error);
      this.viewMessageFlash('Erreur de connexion', true);
    });
    
  }

  render() {

    let popupSignView = '';

    if(this.state.popupSignup == true){
      popupSignView =
      <div>
        <div onClick={this.closePopups.bind(this)} className="back-screen"></div>
        <div className="display-flex-center">
          <div className="display-flex-center flex-column popupSigninSignup" onClick={(e) => { e.stopPropagation();}}>
            <div style={{fontSize: '30px'}}>S'inscrire</div>
            <div style={{marginTop:'30px', width: '60%'}}>
              <FormGroup row>
                <Col sm={12}>
                  <Label>Prénom</Label>
                  <Input value={this.state.username} type="text" onChange={() => {this.setState({username: document.querySelector("#username").value})}} autoComplete="off" id="username" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={12}>
                  <Label>Email</Label>
                  <Input value={this.state.email} type="text" onChange={() => {this.setState({email: document.querySelector("#email").value})}} autoComplete="off" id="email" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={12}>
                  <Label>Mot de passe</Label>
                  <Input value={this.state.password1} type="password" onChange={() => {this.setState({password1: document.querySelector("#password1").value})}} autoComplete="off" id="password1" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={12}>
                  <Label>Confirmation du mot de passe</Label>
                  <Input value={this.state.password2} type="password" onChange={() => {this.setState({password2: document.querySelector("#password2").value})}} autoComplete="off" id="password2" />
                </Col>
              </FormGroup>            
              <FormGroup row>
                <Col sm={12} style={{textAlign: 'center'}}>
                <div className="btn btn-forms" onClick={this.saveUser.bind(this)}>Créer le compte</div>              </Col>
              </FormGroup>            
            </div>
          </div>
        </div>

      </div>;
    }else if(this.state.popupSignin == true){
      popupSignView = 
      <div>
        <div onClick={this.closePopups.bind(this)} className="back-screen"></div>
        <div className="display-flex-center">
          <div className="display-flex-center flex-column popupSigninSignup" onClick={(e) => { e.stopPropagation();}}>
            <div style={{fontSize: '30px'}}>Se connecter</div>
            <form method="POST" action="/login" onSubmit={this.login.bind(this)} style={{marginTop:'30px', width: '80%'}}>
              <FormGroup row>
                <Col sm={12}>
                  <Label>Email</Label>
                  <Input value={this.state.email} type="text" onChange={() => {this.setState({email: document.querySelector("#email").value})}} autoComplete="off" id="email" />
                </Col>
              </FormGroup>
              {/* <FormGroup row>
                <Col sm={12}>
                  <Label>Email</Label>
                  <Input value={this.state.email} type="text" onChange={() => {this.setState({email: document.querySelector("#email").value})}} autoComplete="off" id="email" />
                </Col>
              </FormGroup> */}
              <FormGroup row>
                <Col sm={12}>
                  <Label>Mot de passe</Label>
                  <Input value={this.state.password1} type="password" onChange={() => {this.setState({password1: document.querySelector("#password1").value})}} autoComplete="off" id="password1" />
                </Col>
              </FormGroup>           
              <FormGroup row>
                <Col sm={12} style={{textAlign: 'center'}}>
                  <input type="submit" value="Connexion" className="btn btn-forms" />
                </Col>
              </FormGroup>            
            </form>
          </div>          
        </div>
        

      </div>;
    }

    return (
        <div className="vitrine-container">
          <div id="message-flash" style={{height: this.state.heightMsgFlash, backgroundColor: this.state.bgColorMsgFlash}}>
            {this.state.msgFlash}
            <div onClick={this.closeMessageFlash.bind(this)} type="button" className="btn-close-message-flash close" style={{display: this.state.displayBtnCloseMf}} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </div>
            {/* <div className="btn-close-message-flash close"></div> */}
          </div>
          {popupSignView}
            <nav className="header-nav-vitrine">
              <div className="size100">
                <div className="col-sm-3 col-xs-5">
                  <div className="display-flex-center">
                    <div className="display-flex-center main-logo-vitrine"></div>
                  </div>
                </div>
                <div className="col-xs-7 col-sm-4 col-sm-offset-5">
                  <div className="flex-row" style={{height: '68px', alignItems: 'center'}}>
                    <div onClick={this.viewPopupSignin.bind(this)} className="btn-vitrine-header display-flex-center">CONNEXION</div>
                    <div onClick={this.viewPopupSignup.bind(this)} className="btn-vitrine-header display-flex-center">INSCRIPTION</div>
                  </div>
                </div>
              </div>
            </nav>
            <section className="block1 img-vitrine-blocks">
              <div className="size100">
                <div className="img-vitrine-block1 size100">
                </div>
                {/* <video className="img-vitrine-block1"  controls loop>
                  <source src="/client/images/vitrine/Search.mp4" type="video/mp4" />
                </video> */}
                <Container>
                  <Row style={{height: '530px'}}>
                      <div className="col-xs-6" style={{height: '100%'}}>
                        <div className="size100 display-flex-center">
                          <div className="img-block1-logo"></div>
                        </div>
                      </div>
                      <div className="col-xs-6" style={{height: '100%'}}>
                        <div className="display-flex-center flex-column size100">
                          <div className="img-block1-book"></div>
                          <p className="text-block1-msg text-border" style={{margin: '15px 0px'}}>
                            Apprend l'anglais efficacement. Par la lecture.
                          </p>
                          <div className="container-btn-vitrine-begin">
                            <div 
                              className="btn-vitrine-begin display-flex-center" 
                              onClick={this.viewPopupSignin.bind(this)}
                            >
                              Commencer
                            </div>
                          </div>
                        </div>
                      </div>
                  </Row>
                </Container>
              </div>
            </section>
            <section className="block2 img-vitrine-blocks display-flex-center" style={{height: '400px'}}>
                <Container className="size100">
                  <div className="row display-flex-center" style={{height: '100%'}} >
                    <div className="col-xs-6" style={{height: '100%'}}>
                      <div className="display-flex-center size100" style={{padding: '0px 20px'}}>
                        <div className="flex-column">
                          <p className="text1-block2 text-center font-weight-bold">Qu'est-ce que Blue Legend ?</p>
                          <p className="text2-block2 text-center font-weight-bold">Blue Legend est une application web et mobile permettant d'apprendre l'anglais à travers la lecture de textes et de livres.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-6" style={{height: '100%'}}>
                        <div className="img-vitrine-block2"></div>
                    </div>
                  </div>
                </Container>
            </section>
            <section className="block3 img-vitrine-blocks display-flex-center">
              <Container className="img-vitrine-block3 size100">
                <div className="row minH600Desktop" style={{height:'100%'}}>
                  <div className="col-xs-6 col-xs-offset-6 col-sm-offset-6 display-flex-center minH600Desktop" style={{height: '100%'}}>
                    <div className="size100 text-border display-flex-center flex-column">
                      <p className="text1-block3 text-center font-weight-bold">Apprend en lisant tes textes et contenus préférés.</p>
                      <p className="text2-block3 text-center font-weight-bold">Choisis les livres et contenus qui te passionnent. Lis tes textes et enregistre les mots de vocabulaire et expression que tu souhaites.</p>
                    </div>
                  </div>                  
                </div>
              </Container>
            </section>
            <section className="block4 img-vitrine-blocks display-flex-center">
              <Container className="size100">
                <Row style={{height:'100%'}}>
                  <div className="col-xs-6" style={{height:'400px'}}>
                    <div className="size100 display-flex-center flex-column">
                      <p className="text1-block4 text-center font-weight-bold">Apprend efficacement ton vocabulaire.</p>
                      <p className="text2-block4 text-center font-weight-bold">Révise ton vocabulaire avec des séries de révision intéractives.</p>
                    </div>
                  </div>
                  <div className="col-xs-6" style={{height:'100%'}}>
                    <div className="img-vitrine-block4"></div>
                  </div>                
                </Row>
              </Container>
            </section>
            <section className="block5 img-vitrine-blocks display-flex-center">
              <Container className="size100">
                <Row style={{height:'100%'}}>
                  <div className="col-xs-6 display-flex-center" style={{height:'400px'}}>
                      <div className="img-vitrine-block5"></div>
                  </div>
                  <div className="col-xs-6" style={{height:'400px'}}>
                    <div className="size100 display-flex-center flex-column">
                      <p className="text1-block5 text-center font-weight-bold">Met-toi au défi en jouant contre la montre.</p>
                      <p className="text2-block5 text-center font-weight-bold">Tu as la possibilité de mettre au chronomètre lors de chacune de tes séries de révision afin de te mettre au défi et de voir la qualité de ton apprentissage.</p>
                    </div>
                  </div>                
                </Row>
              </Container>
            </section>
            <section className="block6 img-vitrine-blocks display-flex-center">
              <Container className="size100">
                <Row style={{height:'100%'}}>
                  <div className="col-xs-6" style={{height:'400px'}}>
                    <div className="size100 display-flex-center flex-column">
                      <p className="text1-block6 text-center font-weight-bold">Mémorise durablement grâce à la méthode de répétitions espacés</p>
                    </div>
                  </div>
                  <div className="col-xs-6" style={{height:'400px'}}>
                      <div className="img-vitrine-block6"></div>
                  </div>    
                </Row>
              </Container>
            </section>
            <section className="block7 img-vitrine-blocks display-flex-center">
              <Container className="size100">
                <Row style={{height:'100%'}}>
                  <div className="col-xs-6" style={{height:'400px'}}>
                      <div className="img-vitrine-block7"></div>
                  </div>
                  <div className="col-xs-6" style={{height:'400px'}}>
                    <div className="size100 display-flex-center flex-column">
                      <p className="text1-block7 text-center font-weight-bold">En ligne ou hors ligne, révise tes textes où que tu soit.</p>
                      <p className="text2-block7 text-center font-weight-bold">Notre application est disponible IOS et Android et est utilisable en mode hors-ligne.</p>
                    </div>
                  </div>                
                </Row>
              </Container>
            </section>
            <section className="block8 footer-vitrine display-flex-center">
              <Container className="size100">
                <Row style={{height: '100%'}}>
                  <div className="col-sm-5" style={{height: '100%'}}>
                    <div className="size100 display-flex-center flex-row">
                      <div className="img-block1-logo" style={{width: '180px', height: '150px'}}></div>
                      <div className="main-logo-vitrine"></div>
                    </div>
                  </div>
                  <div className="col-sm-7" style={{height: '100%'}}>
                    <div className="size100 display-flex-center flex-column" style={{alignItems: 'flex-start'}}>
                      <p sm={3} className="text-border" style={{textAlign: 'left', fontSize: '20px', width: '100%'}}>Abonne-toi et soit informé de toutes les nouvelles fonctionnalités à venir</p>
                      <FormGroup row style={{width: '80%', marginTop: '20px'}}>
                        <Col sm={12}>
                          <div className="row">
                            <div className="col-sm-10">
                              <Input type="text" autoComplete="off" id="newsletter" style={{marginTop:"5px"}}/>
                            </div>
                            <div className="col-sm-2">
                              <button className="btn" style={{backgroundColor:"#f5f5ff", marginTop:"5px"}}>Envoyer</button>
                            </div>
                          </div>
                          
                          
                        </Col>
                      </FormGroup>
                    </div>
                  </div>
                </Row>
              </Container>
            </section>
          </div>
    );
  }
}