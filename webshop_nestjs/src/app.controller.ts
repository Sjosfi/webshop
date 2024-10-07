import { Body, Controller, Get, HttpRedirectResponse, Post, Redirect, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Felhasznalo } from './Felhasznalo.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  #Felhasznalok: Felhasznalo[] = [];

  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return{
      data:{},
      errors:[]
    }
  }


  @Post("rendeles")
  rendeles(
    @Body() Felhasznalo:Felhasznalo,
    @Res() response: Response)
  {

    console.log(Felhasznalo)
    let errors=[];
    
    if(!Felhasznalo.nev||!Felhasznalo.szamlazasiCim||!Felhasznalo.szallitasiCim||!Felhasznalo.lejarat||!Felhasznalo.kartyaSzam||!Felhasznalo.cvc){
      errors.push("Minden mezőt ki kell tölteni!")
    }
    if(!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(Felhasznalo.kartyaSzam)){
      errors.push("A megfelelő kártyaszám formátum: XXXX-XXXX-XXXX-XXXX");
    }
    if(!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(Felhasznalo.lejarat)){
      errors.push("A megfelelő lejárati formátum: HH/ÉÉ");
    }
    if(!/^\d{3}$/.test(Felhasznalo.cvc)){
      errors.push("A megfelelő formátum: XXX")
    }


    if (errors.length > 0) {
      response.render('index', {
        data: Felhasznalo,
        errors
      })
      return{
        errors
      }
    }
    
    const Rendeles: Felhasznalo = {
      nev: Felhasznalo.nev,
      szamlazasiCim: Felhasznalo.szamlazasiCim,
      szallitasiCim: Felhasznalo.szallitasiCim,
      kartyaSzam: Felhasznalo.kartyaSzam,
      lejarat: Felhasznalo.lejarat,
      cvc: Felhasznalo.cvc
    }
    this.#Felhasznalok.push(Rendeles);
    console.log(this.#Felhasznalok);
    return response.redirect('/success')

  }

  @Get('success')
  @Render('success')
  Siker(){
    return;
  }
  
}
