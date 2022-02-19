import {Server} from "http";
import {Server as SocketIO, Socket} from 'socket.io'
import {FeedbackModel} from "./FeedbackModel";
import {randomUUID} from "crypto";
import {Storage} from "./storage";

export type Subject = {
    name: string,
    feedbacks: Map<string, FeedbackModel>
}

const storage = new Storage()
let sockets: Map<string, Socket> = new Map<string, Socket>()



function emitSubjectToSocket(socket: Socket, subjects: Array<Subject>) {
    const userData = storage.getUserData(socket.id)

    const newSubjects: Array<{ name: string, feedbacks: Array<FeedbackModel> }> = subjects.map(subject => {
        return {
            name: subject.name,
            feedbacks: Array.from(subject.feedbacks.values()).map(feedback => {
                const userReaction = userData.getFeedbackReaction(feedback.id!!)
                return {...feedback, reaction: userReaction}
            })
        }
    })
    socket.emit('subject', newSubjects)
}

function emitSubjectToAll(subjects: Array<Subject>) {
    sockets.forEach(socket => emitSubjectToSocket(socket, subjects))
}

function onClientConnected(io: SocketIO, socket: Socket) {
    sockets.set(socket.id, socket)
    socket.on("disconnect", () => {
        sockets.delete(socket.id)
        console.log('Client Disconnected ' + socket.id)
    })

    console.log('Client Connected ', socket.id)
    emitSubjectToSocket(socket, storage.getAllSubjects()!!)

    // handle feedback event
    socket.on('feedback', (f: FeedbackModel) => {
        const feedback: FeedbackModel = {
            ...f,
            id: f.id || randomUUID(),
            writerNickname: "Eriter"
        }
        if (storage.isFeedbackExists(feedback)) {
            if (storage.upsetFeedback(feedback, socket.id)) {
                emitSubjectToSocket(socket, [storage.getSubject(feedback.subject)!!])
            }
        } else {
            storage.insertFeedback(feedback, socket.id)
            emitSubjectToAll([storage.getSubject(feedback.subject)!!])
        }
    })

}

export function initializeSocketIo(server: Server) {
    const io = new SocketIO(server, {
        cors: {
            origin: '*'
        }
    })
    storage.addSubject("Niggers")
    io.on("connection", socket => onClientConnected(io, socket))
}
