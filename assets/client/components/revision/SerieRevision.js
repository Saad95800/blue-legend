import React, { Component } from 'react';
import axios from 'axios';
import ReactCountdownClock from 'react-countdown-clock';

export default class serieRevision extends Component {

  constructor(props){
    super(props);

    let clock = '';

    this.state = {
      numQuestion: 0,
      stepRev: "Question",
      stepRevs: {
        "1": "Question",
        "2": "Validation",
        "3": "Resultat"
      },
      stateQuestion: {
        logoUrlValidation: "",
        logoDisplayValidation: "none",
        messageValidation: "",
        btnValidation: "Valider",
        inputTextValue: "",
        colorMessageValidation: "#26DF38"
      },
      score: 0,
      expressions:[],
      clock: 'enabled'
    }

  }

  componentDidMount(){

    axios({
      method: 'post',
      url: '/get-serie-by-text',
      responseType: 'json',
      data: {id_text: this.props.data.location.pathname.split('/')[3]}
    })
    .then((response) => {
      this.setState({expressions: response.data.expression});
    })
    .catch( (error) => {
      console.log(error);
    });
  }

  validate(){
    let res = this.state.expressions[this.state.numQuestion].french_value.toLowerCase() == document.querySelector("#inputResponse").value.toLowerCase();
    let last = this.state.numQuestion == this.state.expressions.length - 1;
    let msg = "Suivant";
    if(last){
      msg = "Résultats";
    }
    if(res){
      this.setState({stateQuestion:{btnValidation: msg, colorMessageValidation: "rgb(38, 223, 56)", messageValidation: "Bonne réponse"}, score: this.state.score+1, stepRev: "Validation", clock: 'disabled'});
    }else{
      this.setState({stateQuestion:{btnValidation: msg, colorMessageValidation: "red", messageValidation: this.state.expressions[this.state.numQuestion].french_value}, stepRev: "Validation", clock: 'disabled'});
    }
  }

  next(){
    if( this.state.numQuestion == this.state.expressions.length - 1){
      this.setState({stateQuestion:{btnValidation: "Résultats", messageValidation: ""}, stepRev: "Resultat"});
    }else{
      this.setState({stateQuestion:{btnValidation: "Valider", messageValidation: ""}, stepRev: "Question", numQuestion: this.state.numQuestion+1, clock: 'enabled'});
    }
    document.querySelector("#inputResponse").value = "";
  }

  viewResult(){
    console.log('result');
  }

  verifKey(e){
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if(keycode == '13'){
      if(this.state.stepRev == 'Question'){
        this.validate();
      }else{
        this.next();
      }
    }
  }

  render() {
    let displayExo = 'block';
    let displayRes = 'none';
    let func = '';
    if(this.state.stepRev == "Question"){
      func = this.validate;
    }else if(this.state.stepRev == "Validation"){
      func = this.next;
    }else{
      func = this.viewResult;
      displayExo = 'none';
      displayRes = 'flex';
    }
    let text = '';
    if(this.state.expressions[this.state.numQuestion] !== undefined){
      text = this.state.expressions[this.state.numQuestion].english_value;
    }
    let clock = '';
    if(this.props.num_mode == 2){
      let count = 0;
      if(this.state.clock == 'enabled'){
        count = 5;
      }
      clock = <ReactCountdownClock 
                seconds={count}
                color="#ffd23d"
                alpha={0.9}
                size={100}
                onComplete={this.validate.bind(this)} /> 

    }
    return (
            <div>
                <div id="clock" style={{position: 'fixed', top: '95px', right: '20px'}}>{clock}</div>
                <div style={styles.blockSerie}>
                  <div style={{display: displayExo}}>
                    <div style={{paddingTop: "35px",textAlign: "center",fontWeight: "bold",fontSize: "30px"}}>{text}</div>
                    <div style={{textAlign: "center"}}>
                      <input type="text" id="inputResponse" onKeyPress={this.verifKey.bind(this)} style={{width: "90%", height: "80px", fontSize: "40px", marginTop: "50px"}}/>
                    </div>
                    <div style={{height:"30px", marginLeft:"30px", marginTop:"10px", fontSize: "30px", color: this.state.stateQuestion.colorMessageValidation}}>{this.state.stateQuestion.messageValidation}</div>
                  
                    <div style={{textAlign: "center"}}>
                      <div style={styles.btnSuivant} onClick={func.bind(this)}>{this.state.stateQuestion.btnValidation}</div>
                    </div>
                  </div>
                  <div style={{display: displayRes, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', fontWeight: 'bold', fontSize: '100px'}}>
                    <div>
                      <div>Score</div>
                      <div style={{textAlign: 'center'}}>{this.state.score}/{this.state.expressions.length}</div>
                    </div>
                  </div>
                </div>
            </div>
    );

  }
}

let styles = {
  blockSerie: {
    width: "60%",
    minWidth: "600px",
    height: "400px",
    backgroundColor: "#FFFBF1",
    borderRadius: "10px",
    border: "1px solid #c7c7c7",
    marginTop: "30px"
  },
  btnSuivant: {
    display: "inline-flex",
    width: "260px",
    height: "80px",
    borderRadius: "50px",
    backgroundColor: "#26DF38",
    color: "white",
    fontWeight: "block",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "40px",
    marginTop: "50px"
  }
}