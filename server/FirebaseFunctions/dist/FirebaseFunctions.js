"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMufasaFunctions = void 0;
// See a full list of supported triggers at https://firebase.google.com/docs/functions
// Start writing functions: https://firebase.google.com/docs/functions/typescript
// Writing Callable Functions: https://firebase.google.com/docs/functions/callable?gen=2nd
var https_1 = require("firebase-functions/v2/https");
var firestore_1 = require("firebase-admin/firestore");
var uuid_1 = require("uuid");
var logger_1 = require("firebase-functions/logger");
function initializeMufasaFunctions(_a) {
    var _this = this;
    var firestore = _a.firestore, auth = _a.auth;
    // SECTION: Utils
    var callableOptions = {
        cors: true,
        ingressSettings: "ALLOW_ALL",
    };
    function getStage(stage) {
        return stage !== null && stage !== void 0 ? stage : "Dev";
    }
    function setUserWorkspace(params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, logger_1.log)("setUserWorkspace", params);
                        // We need to set CustomUserClaims first, and then let the user know they have new permission.
                        return [4 /*yield*/, auth.setCustomUserClaims(params.uid, {
                                workspaceId: params.workspaceId,
                                role: (_a = params.role) !== null && _a !== void 0 ? _a : null,
                            })];
                    case 1:
                        // We need to set CustomUserClaims first, and then let the user know they have new permission.
                        _c.sent();
                        (0, logger_1.log)("updated custom claims");
                        return [4 /*yield*/, firestore
                                .doc("".concat(getStage(params.stage), "-UserMetadata/").concat(params.uid))
                                .set({
                                uid: params.uid,
                                workspaceId: params.workspaceId,
                                mx_changeDate: firestore_1.FieldValue.serverTimestamp(),
                                role: (_b = params.role) !== null && _b !== void 0 ? _b : null,
                                email: params.email,
                            } /* satisfies UserMetadata */)];
                    case 2:
                        _c.sent();
                        (0, logger_1.log)("updated firestore");
                        return [2 /*return*/];
                }
            });
        });
    }
    // SECTION: Functions
    return {
        createWorkspace: (0, https_1.onCall)(callableOptions, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var user, userIsAlreadyInAWorkspace;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Validate user
                        if (request.auth === undefined)
                            throw new Error("Unauthorized");
                        return [4 /*yield*/, firestore
                                .doc("".concat(getStage(request.data.stage), "-UserMetadata/").concat(request.auth.uid))
                                .get()];
                    case 1:
                        user = _d.sent();
                        userIsAlreadyInAWorkspace = user.exists && ((_a = user.data()) === null || _a === void 0 ? void 0 : _a.workspaceId) !== null;
                        if (userIsAlreadyInAWorkspace)
                            throw new Error("Must leave your current workspace before you can start another.");
                        // Start Workspace
                        return [4 /*yield*/, setUserWorkspace({
                                uid: request.auth.uid,
                                workspaceId: request.auth.token.email !== undefined &&
                                    [
                                        "peter@axiomhoist.com",
                                        "peterhotrum@axiomhoist.com",
                                        "melchiahmauck@gmail.com",
                                    ].includes((_b = request.auth.token.email) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase())
                                    ? "axiom-hoist"
                                    : (0, uuid_1.v4)(),
                                role: "owner",
                                email: (_c = request.auth.token.email) !== null && _c !== void 0 ? _c : null,
                                stage: request.data.stage,
                            })];
                    case 2:
                        // Start Workspace
                        _d.sent();
                        return [2 /*return*/, {}];
                }
            });
        }); }),
        joinWorkspace: (0, https_1.onCall)(callableOptions, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var user, userIsAlreadyInOrg, inviteDocRef, inviteDoc, invite;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Validate user
                        if (request.auth === undefined)
                            throw new Error("Unauthorized");
                        return [4 /*yield*/, firestore
                                .doc("".concat(getStage(request.data.stage), "-UserMetadata/").concat(request.auth.uid))
                                .get()];
                    case 1:
                        user = _c.sent();
                        userIsAlreadyInOrg = user.exists && ((_a = user.data()) === null || _a === void 0 ? void 0 : _a.orgId) !== null;
                        if (userIsAlreadyInOrg)
                            throw new Error("Must leave workspace before you can join another.");
                        inviteDocRef = firestore.doc("".concat(getStage(request.data.stage), "-WorkspaceInvites/").concat(request.data.inviteCode.trim()));
                        return [4 /*yield*/, inviteDocRef.get()];
                    case 2:
                        inviteDoc = _c.sent();
                        if (!inviteDoc.exists)
                            throw new Error("Invalid invite code.");
                        invite = inviteDoc.data();
                        if (!(Date.now() / 1000 - invite.createdAt.seconds >
                            invite.validForDays * 24 * 60 * 60)) return [3 /*break*/, 4];
                        return [4 /*yield*/, inviteDocRef.delete()];
                    case 3:
                        _c.sent();
                        throw new Error("Invite has expired.");
                    case 4: 
                    // Join workspace
                    return [4 /*yield*/, setUserWorkspace({
                            uid: request.auth.uid,
                            workspaceId: invite.workspaceId,
                            role: "member",
                            email: (_b = request.auth.token.email) !== null && _b !== void 0 ? _b : null,
                            stage: request.data.stage,
                        })];
                    case 5:
                        // Join workspace
                        _c.sent();
                        return [4 /*yield*/, inviteDocRef.delete()];
                    case 6:
                        _c.sent();
                        return [2 /*return*/, {}];
                }
            });
        }); }),
        leaveWorkspace: (0, https_1.onCall)(callableOptions, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, logger_1.log)("leaveWorkspace", request);
                        if (request.auth === undefined)
                            throw new Error("Unauthorized");
                        (0, logger_1.log)("uid", request.auth.uid);
                        return [4 /*yield*/, setUserWorkspace({
                                uid: request.auth.uid,
                                workspaceId: null,
                                email: (_a = request.auth.token.email) !== null && _a !== void 0 ? _a : null,
                                stage: request.data.stage,
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, {}];
                }
            });
        }); }),
        // TODO: deleteWorkspace
    };
}
exports.initializeMufasaFunctions = initializeMufasaFunctions;
