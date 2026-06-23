using Moq;
using SimplyFly.DTOs;
using SimplyFly.Exceptions;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Implementations;

namespace SimplyFly.Tests.TestServices
{
    [TestFixture]
    public class AdminServiceTests
    {
        private Mock<IAdminRepository> _mockRepo;
        private AdminService _adminService;

        [SetUp]
        public void Setup()
        {
            _mockRepo = new Mock<IAdminRepository>();
            _adminService = new AdminService(_mockRepo.Object);
        }

        [Test]
        public async Task GetAllUsersAsync_ReturnsListOfUsers()
        {
            var users = new List<User> {
                new User { UserId = 1, Name = "Test User" } };
            _mockRepo.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(users);

            var result = await _adminService.GetPlatformUsersAsync();

            Assert.That(result.Count(), Is.EqualTo(1));
        }

        [Test]
        public async Task UpdateUserProfileAsync_WhenUserNotFound_ThrowsUserProfileNotFoundException()
        {
            var dto = new UpdateUserDto();
            _mockRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync((User)null);

            Assert.ThrowsAsync<UserProfileNotFoundException>(async () => await _adminService.UpdateUserProfileAsync(1, dto));
        }

        [Test]
        public async Task UpdateUserProfileAsync_WhenUserExists_UpdatesSuccessfully()
        {
            var user = new User { UserId = 1, Name = "Old Name" };
            var dto = new UpdateUserDto { Name = "New Name" };

            _mockRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
            _mockRepo.Setup(r => r.UpdateUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

            await _adminService.UpdateUserProfileAsync(1, dto);

            _mockRepo.Verify(r => r.UpdateUserAsync(It.Is<User>(u => u.Name == "New Name")), Times.Once);
        }

        [Test]
        public async Task DeleteUserAccountAsync_WhenUserNotFound_ThrowsUserAccountNotFoundException()
        {
            _mockRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync((User)null);

            Assert.ThrowsAsync<UserAccountNotFoundException>(async () => await _adminService.DeleteUserAccountAsync(1));
        }

        [Test]
        public async Task DeleteUserAccountAsync_WhenUserExists_DeletesSuccessfully()
        {
            var user = new User { UserId = 1 };
            _mockRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
            _mockRepo.Setup(r => r.DeleteUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

            await _adminService.DeleteUserAccountAsync(1);

            _mockRepo.Verify(r => r.DeleteUserAsync(user), Times.Once);
        }
    }
}