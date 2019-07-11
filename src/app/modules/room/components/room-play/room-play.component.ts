import { Component, OnInit } from "@angular/core";
import { RoomService } from "../../services/room.service";
import { NetworkRoomService } from "../../services/network-room.service";
import { take, switchMap, tap } from "rxjs/operators";
import { timer } from "rxjs";




@Component({
  selector: "room-play",
  templateUrl: "room-play.component.html",
  styleUrls: ["room-play.component.scss"]
})

export class RoomPlayComponent implements OnInit {

  readonly ANSWER_VIEW: string = "answer_view";
  readonly QUESTION_VIEW: string = "question_view";

  showAnswerTip: boolean;
  showQuestionTip: boolean;

  currUsername: string;

  currQuestion;
  buddyName: string;

  canClickAnswers: boolean;

  viewType: string;

  constructor(
    private roomService: RoomService,
    private nRoomService: NetworkRoomService
  ) {
    this.currUsername = this.roomService.getCurrUserUsername();
    this.buddyName = this.roomService.getBuddyName();
  }

  ngOnInit() {
    this.showAnswerTip = true;
    this.showQuestionTip = true;
    this.viewType = this.ANSWER_VIEW;
    this.canClickAnswers = true;
    this.currQuestion = {
      questionText: "",
      options: []
    };
    let s = this.nRoomService.networkPipe(this.nRoomService.getUnseenCount())
      .subscribe(b => {
        this.roomService.setUnseenCount(b.unseenCount);
        console.log("Unseen count: ", this.roomService.getUnseenCount());
        if (b.unseenCount > 0) {
          this.viewType = this.ANSWER_VIEW;
          this.showAnswer();
        } else {
          this.viewType = this.QUESTION_VIEW;
          this.getQuestion();
        }
        s.unsubscribe();
      });
  }

  getQuestion() {
    let s = this.nRoomService.networkPipe(this.nRoomService.getQuestion())
      .subscribe(body => {
        this.roomService.setCurrQuesRoom(body);
        this.currQuestion = this.roomService.getCurrQuesRoom().questionRef;
        s.unsubscribe();
    });
  }

  // When the current user answers a question
  onAnswer(i) {
    this.canClickAnswers = false;
    const s = this.nRoomService.networkPipe(this.nRoomService.postAnswer(i))
      .subscribe(body => {
        this.getQuestion();
        this.canClickAnswers = true;
        s.unsubscribe();
    });
  }

  showAnswer() {
    if (this.roomService.getUnseenCount() <= 0) {
      this.viewType = this.QUESTION_VIEW;
      this.getQuestion();
      return ;
    }
    const s = this.nRoomService.networkPipe(this.nRoomService.getAnswer())
      .pipe(
        tap(x => this.roomService.decrementUnseenCount())
      ).subscribe(body => {
        console.log(body);
        this.roomService.setCurrQuesRoom(body);
        this.currQuestion = this.roomService.getCurrQuesRoom().questionRef;
        this.currQuestion.answerIndex = this.roomService.getBuddyAnswerIndex();
        s.unsubscribe();
      })
  }

  closeTip(type: number) {
    let s = timer(500).pipe(take(1)).subscribe(e => {
      s.unsubscribe();
      if (!type) {
        this.showAnswerTip = false;
        return;
      }
      this.showQuestionTip = false;
    });
  }

}
