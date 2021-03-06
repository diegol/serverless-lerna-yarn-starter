import { Injectable } from "@nestjs/common";

@Injectable()
export class CatsService {
  getData(): string {
    return `Read these survey responses to the question "How do you feel about your Christmas spending?" and then answer the following questions:
    """
    Christmas spending is fun and not so fun.  Fun because you buy presents for family and friends and bring a smile to them with a thoughtful gift you think they would need or want :-). It can be a bit stressful on the bank balance though and I find most spend a few or many months after that trying to manage their debts.
    Testing information about my Christmas spending and trying to write a really long response to avoid getting the category warning from GCP.
    This year was easy as only had immediate family to buy for.  My children are teenagers so mainly only want money plus some smaller Santa sack stuff.  I didn't shop until Christmas Eve and by then there wasn't much left in the shops.  I managed to find enough to buy to fill the sacks.  I stuck to my budget so overall spending was as planned.
    I wish I'd got organised earlier but overall I felt there were lots of good deals earlier this year.   I took advantage of Black Friday and Cyber Monday to do most of it earlier than normal.
    I FEEL GREAT WOW
    I feel great
    """
    Questions:
    1. How do consumers feel about their Christmas spending?
    2. Are consumers spending too much money?
    Answers:`;
  }
}
