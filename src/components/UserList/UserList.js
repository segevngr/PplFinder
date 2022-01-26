import React, { useEffect, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";

const UserList = ({ users, isLoading }) => {
  const [hoveredUserId, setHoveredUserId] = useState();
  const [checkedCountries, setCheckedCountries] = useState(
    {Brazil: false, Australia: false, Canada: false, Germany: false, France: false});
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    filterUsers();
  }, [checkedCountries]);

  const filterUsers = () => {
    let checkedCountriesSet = new Set();
    let isChecked = false
    for(let country in checkedCountries) {
      if(checkedCountries[country]) {
        checkedCountriesSet.add(country);
        isChecked = true;
      }
    }
    if(!isChecked) {
      setFilteredUsers(users);
      return;
    }
    const newUsersList = users.filter(user => checkedCountriesSet.has(user.location.country))
    setFilteredUsers(newUsersList);
  }

  const toggleCountry = (country) => {
    const countryStatus = checkedCountries[country];
    setCheckedCountries(oldState=> ({ ...oldState, [country]: !countryStatus }));
  }

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  return (
    <S.UserList>
      <S.Filters>
        <CheckBox value="BR" label="Brazil" onChange={toggleCountry} isChecked={checkedCountries.Brazil}/>
        <CheckBox value="AU" label="Australia" onChange={toggleCountry} isChecked={checkedCountries.Australia} />
        <CheckBox value="CA" label="Canada" onChange={toggleCountry} isChecked={checkedCountries.Canada}/>
        <CheckBox value="DE" label="Germany" onChange={toggleCountry} isChecked={checkedCountries.Germany}/>
        <CheckBox value="FR" label="France" onChange={toggleCountry} isChecked={checkedCountries.France}/>
      </S.Filters>
      <S.List>
        {filteredUsers.map((user, index) => {
          return (
            <S.User
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <S.UserPicture src={user?.picture.large} alt="" />
              <S.UserInfo>
                <Text size="22px" bold>
                  {user?.name.title} {user?.name.first} {user?.name.last}
                </Text>
                <Text size="14px">{user?.email}</Text>
                <Text size="14px">
                  {user?.location.street.number} {user?.location.street.name}
                </Text>
                <Text size="14px">
                  {user?.location.city} {user?.location.country}
                </Text>
              </S.UserInfo>
              <S.IconButtonWrapper isVisible={index === hoveredUserId}>
                <IconButton>
                  <FavoriteIcon color="error" />
                </IconButton>
              </S.IconButtonWrapper>
            </S.User>
          );
        })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList>
  );
};

export default UserList;
