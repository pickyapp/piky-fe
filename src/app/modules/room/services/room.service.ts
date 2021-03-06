import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { RoomUser } from "../types/room-user.interface";
import { Room } from "../types/room.interface";
import { createRoom, populateRoom } from '../types/room.functions';
import { createRoomUser } from "../types/room-user.functions";




@Injectable()
export class RoomService {

  private readonly QUESTION_LIMIT: number = 5;

  private currUser: RoomUser;
  private currRoom: Room;
  private currentQuesRoom;

  private shareUrl: string;


  constructor() {
    this.currUser = createRoomUser();
    this.shareUrl = environment.domain;
  }

  populateRoom(body: any) {
    this.currRoom = populateRoom(this.currRoom, body.urlId, body.users.map(user => {
      return {
        username: user.username,
        tipsSeen: user.tipsSeen,
        unseenCount: user.unseenCount,
        unansweredQuestionAmount: user.unansweredQuestionAmount
      };
    }));
  }

  createRoom() {
    this.currRoom = createRoom();
  }

  setCurrUserUsername(user: string) {
    this.currUser.username = user;
  }

  getCurrUserUsername(): string {
    return this.currUser.username;
  }

  getBuddyName(): string {
    const name = this.currRoom.users.filter(u => u.username !== this.getCurrUserUsername())[0].username;
    return name.charAt(0).toUpperCase() + name.substr(1);
  }

  getOtherName(username: string): string {
    const name = this.currRoom.users.filter(u => u.username !== username)[0].username;
    return name.charAt(0).toUpperCase() + name.substr(1);
  }

  getBuddyAnswerIndex(): number {
    return this.currentQuesRoom.users.filter(u => u.username !== this.getCurrUserUsername())[0].answerIndex;
  }

  getUrlId(): string {
    return this.currRoom.urlId;
  }

  getUsernames(): string[] {
    return this.currRoom.users.map(user => user.username);
  }

  setUnseenCount(username: string, unseenCount: number) {
    const updatedUsers = this.currRoom.users.map(user => {
      if (user.username === username) return {...user, unseenCount };
      return user;
    });
    this.currRoom.users = updatedUsers;
  }

  getUnseenCount(username: string): number {
    return this.currRoom.users.filter(user => user.username === username)[0].unseenCount;
  }

  setCurrQuesRoom(quesroom) {
    this.currentQuesRoom = quesroom;
  }

  getCurrQuesRoom() {
    return this.currentQuesRoom;
  }

  decrementUnseenCount() {
    this.setUnseenCount(this.getCurrUserUsername(), this.getUnseenCount(this.getCurrUserUsername()) - 1);
    this.currUser.unseenCount--;
  }

  getTipIsSeen(tipIndex: number): boolean {
    return this.currRoom.users.filter(u => u.username === this.getCurrUserUsername())[0].tipsSeen[tipIndex];
  }

  getCommonTipIsSeen(tipIndex: number): boolean {
    const unseenUsers = this.currRoom.users.filter(user => !user.tipsSeen[tipIndex]);
    return unseenUsers.length === 0;
  }

  setTipIsSeen(tipIndex: number) {
    const updatedUsers = this.currRoom.users.map(user => {
      if (user.username === this.getCurrUserUsername()) {
        return { ...user, tipsSeen: user.tipsSeen.map((tip, i) => i === tipIndex ? true : tip)};
      }
      return user;
    });
    this.currRoom.users = updatedUsers;
  }

  getQuestionLimit(): number {
    return this.QUESTION_LIMIT;
  }

  setUnansweredQuestionAmount(username: string, unansweredQuestionAmount: number) {
    const updatedUsers = this.currRoom.users.map(user => {
      if (user.username === username) return { ...user, unansweredQuestionAmount };
      return user;
    });
    this.currRoom.users = updatedUsers;
  }

  getUnansweredQuestionAmount(username: string): number {
    return this.currRoom.users.filter(user => user.username === username)[0].unansweredQuestionAmount;
  }

  decrementUnansweredQuestionAmount(username: string) {
    this.setUnansweredQuestionAmount(username, this.getUnansweredQuestionAmount(username) - 1);
  }

  setShareUrl(url: string) {
    this.shareUrl = url;
  }

  getShareUrl(): string {
    return this.shareUrl;
  }

  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }
}