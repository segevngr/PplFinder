import React, { useEffect, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const UserList = ({ users, isLoading, page, updateFavoritesList }) => {
  const [usersList, setUsersList] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState();
  const [checkedCountries, setCheckedCountries] = useState(new Set());
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setUsersList(users);
    console.log(users)
  }, [users]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [usersList]);

  useEffect(() => {
    filterUsers();
  }, [checkedCountries]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  const handleClick = (user) => {
    if (page === "favorites") {
      updateFavoritesList(user.login.uuid);
    }
    const idx = getFavoriteIdx(user.login.uuid);
    if (idx < 0) {
      addToFavorites(user);
    } else {
      removeFromFavorites(user.login.uuid, idx);
    }
  };

  // Filter methods:
  const filterUsers = () => {
    if (!checkedCountries.size) {
      setFilteredUsers(users);
    } else {
      const newUsersList = users.filter(user => checkedCountries.has(user.location.country));
      setFilteredUsers(newUsersList);
    }
  };

  const toggleCountry = (country) => {
    if (checkedCountries.has(country)) {
      setCheckedCountries(prev => new Set([...prev].filter(x => x !== country)));
    } else {
      setCheckedCountries(prev => new Set(prev.add(country)));
    }
  };

  // Favorites methods:
  const addToFavorites = (user) => {
    const newFavorites = favorites.slice();
    newFavorites.push(user.login.uuid);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    localStorage.setItem(user.login.uuid, JSON.stringify(user));
  };

  const removeFromFavorites = (uuid, idx) => {
    const newFavorites = [...favorites.slice(0, idx), ...favorites.slice(idx + 1)];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    localStorage.removeItem(uuid);
  };

  const loadFavorites = () => {
    const currFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(currFavorites);
  };

  const getFavoriteIdx = (uuid) => {
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i] === uuid)
        return i;
    }
    return -1;
  };

  async function fetchNextUsers() {
    axios.get(`https://randomuser.me/api/?results=25&page=1`).then(response => {
      const nextUsers = (response.data.results)
      const newUsersList = usersList.concat(nextUsers)
      setUsersList(newUsersList)
    })
  }

  return (
    <S.UserList>
      <S.Filters>
        <CheckBox value="BR" label="Brazil" onChange={toggleCountry} isChecked={checkedCountries.Brazil} />
        <CheckBox value="AU" label="Australia" onChange={toggleCountry} isChecked={checkedCountries.Australia} />
        <CheckBox value="CA" label="Canada" onChange={toggleCountry} isChecked={checkedCountries.Canada} />
        <CheckBox value="DE" label="Germany" onChange={toggleCountry} isChecked={checkedCountries.Germany} />
        <CheckBox value="FR" label="France" onChange={toggleCountry} isChecked={checkedCountries.France} />
      </S.Filters>
      <InfiniteScroll
        dataLength={filteredUsers.length}
        next={fetchNextUsers}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <S.List>
          {filteredUsers.map((user, index) => {
            return (
              <S.User
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(user)}
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
                <S.IconButtonWrapper isVisible={index === hoveredUserId || getFavoriteIdx(user.login.uuid) >= 0}>
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
      </InfiniteScroll>
    </S.UserList>
  );
};

export default UserList;
