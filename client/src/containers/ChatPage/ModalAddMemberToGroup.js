import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import selectors from "./selectors";
import userActions from "../UserPage/actions";
import userSelectors from "../UserPage/selectors";
import {
    Modal,
    Button,
    AutoComplete,
    List,
    Input,
    Divider,
    Checkbox,
    Icon,
} from "antd";
import ListUser from "./styles/ListUser";
import AvatarCus from "../../components/AvatarCus";
import actions from "./actions";

function ModalAddMemberToGroup({ visible, doToggle }) {
    const dispatch = useDispatch();
    const record = useSelector(selectors.selectRecord);
    const users = useSelector(userSelectors.selectUsers);
    const currentUser = useSelector(userSelectors.selectCurrentUser);
    const [newMembers, setNewMembers] = useState([]);

    const isMemberAdded = (userId) => {
        const memberExists = record.receiver.members.find(
            (item) => item.id === userId
        );
        return memberExists ? true : false;
    };

    const idNewMemberAdded = (userId) => {
        const memberExists = newMembers.find((item) => item.id === userId);
        return memberExists ? true : false;
    };

    const renderUsers = (users) => {
        return users.map((user, key) => (
            <div
                className="list-item list-item-hover"
                key={key}
                onClick={() => {
                    if (!isMemberAdded(user.id)) {
                        if (!idNewMemberAdded(user.id)) {
                            setNewMembers([...newMembers, user]);
                        } else {
                            let tempNewMembers = newMembers;
                            tempNewMembers = tempNewMembers.filter(
                                (item) => item.id !== user.id
                            );
                            setNewMembers(tempNewMembers);
                        }
                    }
                }}
            >
                <div>
                    <AvatarCus className="avatar" record={user} />
                    {`${user.firstname} ${user.lastname}`}
                </div>
                <div style={{ lineHeight: "40px", marginRight: "5px" }}>
                    {user.id === currentUser.id
                        ? "You"
                        : isMemberAdded(user.id)
                        ? "Added"
                        : null}
                    {idNewMemberAdded(user.id) && (
                        <Icon type="check" style={{ color: "#1890ff" }} />
                    )}
                </div>
            </div>
        ));
    };

    const handleOnOkClick = () => {
        dispatch(actions.doAddNewMembers({groupId: record.receiver.id, members: newMembers}))
        doToggle();
    };

    useEffect(() => {
        dispatch(userActions.list());
    }, []);

    return (
        <Modal
            title="Add people"
            visible={visible}
            onOk={handleOnOkClick}
            okButtonProps={{
                disabled: newMembers.length > 0 ? false : true,
            }}
            okText="Add"
            onCancel={doToggle}
        >
            <ListUser style={{ maxHeight: "400px", overflowY: "auto" }}>
                {renderUsers(users)}
            </ListUser>
        </Modal>
    );
}

export default ModalAddMemberToGroup;
