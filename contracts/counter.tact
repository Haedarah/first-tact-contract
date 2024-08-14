import "@stdlib/deploy";

message IncrementBy {
    value: Int as uint256;
}

contract Counter with Deployable {
    
    id: Int as uint256;
    counter: Int as uint256;
    
    init(_id: Int){
        self.counter=0;
        self.id=_id;
    }

    receive("increment"){
        self.counter = self.counter + 1;
    }

    receive(msg: IncrementBy){
        self.counter = self.counter + msg.value;
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }

}
