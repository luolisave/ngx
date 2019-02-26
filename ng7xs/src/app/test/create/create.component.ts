import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AddUser } from '../actions/user.action';
import { User } from '../models/User';

@Component({
  selector: 'abc-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  angForm: FormGroup;
  users: Observable<User>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.createForm();
    this.users = this.store.select(state => state.users.users);
  }

  createForm() {
    this.angForm = this.fb.group({
      name: ['', Validators.required ],
      email: ['', Validators.required ]
   });
  }

  addUser(name, email) {
    console.log(name, email);
    this.store.dispatch(new AddUser({ name, email}));
  }

  ngOnInit() {
  }

}