import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularService } from '../common/angular.service';

@Component({
  selector: 'takePicture',
  templateUrl: './takePicture.component.html',
  styleUrls: ['./takePicture.component.scss'] 
}) 
export class takePictureComponent implements OnInit {
  main: FormGroup;
  driver: any;
  results: any;
  emotionPage: boolean;
  whatPicturePage: boolean;
  takePicturePage: boolean;
  pickImagePage: boolean;
  rulesPage: boolean;
  emotionError: boolean;
  specificError: boolean;
  imageError: boolean;
  emotion: String;
  specific: String;
  image: String;
  images = [];

  constructor(private fb: FormBuilder, private neo4j: AngularService) {}

  ngOnInit() {
    this.emotionPage = true;
    this.whatPicturePage = false;
    this.pickImagePage = false;
    this.rulesPage = false;
    this.takePicturePage = false;
  }

  emotionSelect(){
    var ele = document.getElementsByTagName('input');
    for (var i = 0; i< ele.length; i++){
      if(ele[i].type=="radio"){
        if(ele[i].checked){
          this.emotion = ele[i].value;
        }
      }
    }
    if(this.emotion == undefined){
      this.emotionError = true;
    }
    else{
      this.emotionError = false;
      this.emotionPage = false;
      this.whatPicturePage = true;
    }
  }

  resetEmotion(){
    this.emotionError = false;
    this.emotion = undefined;
    this.whatPicturePage = false;
    this.emotionPage = true;
  }

  whatPictureSelect(){
    var ele = document.getElementsByTagName('input');
    for (var i = 0; i< ele.length; i++){
      if(ele[i].type=="radio"){
        if(ele[i].checked){
          this.specific = ele[i].value;
      }
    }
  }
    if(this.specific == undefined){
      this.specificError = true;
    }
    else{
      this.specificError = false;
      this.whatPicturePage = false;
      if(this.specific == 'specific'){
        this.pickImagePage = true;
        this.loadSelectImage();
      }
      else{
        this.rulesPage = true;
        this.loadRandomImage();
      }
    }
  }

  resetWhatPicture(){
    this.pickImagePage = false;
    this.whatPicturePage = true;
    this.specificError = false;
    this.specific = undefined;
  }

  selectImage(){
    var ele = document.getElementsByTagName('input');
    for (var i = 0; i< ele.length; i++){
      if(ele[i].type=="radio"){
        if(ele[i].checked){
          this.image = ele[i].id;
        }
      }
    }

    if(this.image == undefined){
      this.imageError = true;
    }
    else{
      this.imageError = false;
      this.pickImagePage = false;
      this.rulesPage = true;
    }
  }

  resetImageSelect(){
    this.rulesPage = false;
    if(this.specific == "specific"){
      this.pickImagePage = true;
      this.imageError = false;
      this.image = undefined;
    }
    else{
      this.whatPicturePage = true;
      this.specificError = false;
      this.specific = undefined;
    }
  }

  rules(){ //When this happens, the raspberry pi should be linked
    this.rulesPage = false;
    this.takePicturePage = true;
  }

  resetRules(){
    this.rulesPage = true;
    this.takePicturePage = false;
  }

  resetEverything(){ 
    this.takePicturePage = false;
    this.emotionPage = true;
    this.emotionError = false;
    this.specificError = false;
    this.imageError = false;
    this.emotion = undefined;
    this.specific = undefined;
    this.image = undefined;
  }

  loadSelectImage(){
    this.images = [];
    const query = 'MATCH (a:Image) WHERE a.emotion= "' + this.emotion + '" RETURN a.location';

    this.neo4j.run(query).then(res => {
      this.results = res;
      var length = this.results.length
      if(this.images){
        for(var i=0; i<length; i++){
          this.images.push(res[i][0])
        }
      }
      else{
        for(var i=0; i<length; i++){
          this.images.pop()
        }
      }
    });
  }

  loadRandomImage(){
    const query = 'MATCH (a:Image) WHERE a.emotion= "' + this.emotion + '" RETURN a.location';

    this.neo4j.run(query).then(res => {
      this.results = res;
      var length = this.results.length
      var i = Math.floor(Math.random() * Math.floor(length));
      this.image = res[i][0]
    });
  }

}
